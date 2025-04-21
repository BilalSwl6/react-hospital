<?php

namespace App\Http\Controllers\drugDeptController;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Log;
use App\Models\Ward;
use App\Models\Expense;
use App\Models\Medicine;
use App\Models\Generic;
use App\Models\ExpenseRecord;
use App\Services\ExcelExportService;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Validate request
        $request->validate([
            'ward_id' => 'nullable|array',
            'ward_id.*' => 'exists:wards,id',
            'medicine_id' => 'nullable|array',
            'medicine_id.*' => 'exists:medicines,id',
        ]);

        // Get active wards and medicines for select2 initial load
        $selectedWards = collect();
        $selectedMedicines = collect();
        $wards = Ward::orderBy('ward_name', 'asc')->where('ward_status', 1)->get();

        if ($request->filled('ward_id')) {
            $selectedWards = Ward::whereIn('id', $request->ward_id)
                ->where('ward_status', 1)
                ->orderBy('ward_name', 'asc')
                ->get();
        }

        if ($request->filled('medicine_id')) {
            $selectedMedicines = Medicine::whereIn('id', $request->medicine_id)
                ->where('status', 1)
                ->orderBy('name', 'asc')
                ->get();
        }

        // Build the query
        $records = Expense::query()
            ->when($request->filled('ward_id'), function ($query) use ($request) {
                return $query->whereIn('ward_id', $request->ward_id);
            })
            ->when($request->filled('medicine_id'), function ($query) use ($request) {
                return $query->whereHas('expenseRecords', function ($subQuery) use ($request) {
                    $subQuery->whereIn('medicine_id', $request->medicine_id);
                });
            })
            ->orderBy('date', 'desc')
            ->with(['ward', 'expenseRecords.medicine']) // Eager load relationships
            ->paginate(12)
            ->withQueryString(); // Append query parameters to pagination links

        return view('drugDept.expense.index', compact(
            'records',
            'selectedWards',
            'selectedMedicines',
            'wards'
        ));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $wards = Ward::orderBy('ward_name', 'asc')->where('ward_status', 1)->get();
        return view('drugDept.expense.create', compact('wards'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required',
            'ward_id' => 'required|exists:wards,id',
            'note' => 'nullable|string',
        ]);

        try {
            // Check if an expense with the same date and ward_id already exists
            $existingExpense = Expense::where('date', $request->date)
                ->where('ward_id', $request->ward_id)
                ->first();

            if ($existingExpense) {
                // Redirect to the existing expense's record creation page
                return redirect()->route('expenseRecord.create', ['expense_id' => $existingExpense->id])
                    ->with('info', 'Expense already exists for this date and ward. Redirected to existing expense.');
            } else {
                // Create a new expense
                $expense = Expense::create([
                    'date' => $request->date,
                    'ward_id' => $request->ward_id,
                    'note' => $request->note,
                    'user_id' => Auth::user()->id,
                ]);
            }
            return redirect()->route('expenseRecord.create', ['expense_id' => $expense->id])
                ->with('success', 'Expense created successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $expense = Expense::findOrFail($id);
        $expenseRecords = ExpenseRecord::where('expense_id', $id)->get();

        return view('drugDept.expense.showRecord', compact('expense', 'expenseRecords'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $expense = Expense::findOrFail($id);
        $wards = Ward::orderBy('ward_name', 'asc')->where('ward_status', 1)->get();
        return view('drugDept.expense.edit', compact('expense', 'wards'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'date' => 'required',
            'ward_id' => 'required|exists:wards,id',
            'note' => 'nullable|string',
        ]);

        try {
            $expense = Expense::findOrFail($id);
            $expense->update([
                'date' => $request->date,
                'ward_id' => $request->ward_id,
                'note' => $request->note,
            ]);

            return redirect()->route('expense.index')->with('success', 'Expense updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $expense = Expense::findOrFail($id);
            $expense->delete();

            return redirect()->route('expense.index')->with('info', 'Expense deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Export the expense records to Excel.
     */
    protected $excelExportService;

    public function __construct(ExcelExportService $excelExportService)
    {
        $this->excelExportService = $excelExportService;
    }

    public function exportToExcel(Request $request)
    {
        // Validate the request
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'ward_id' => 'required',
        ]);

        // Get the records
        $records = ExpenseRecord::with('expense', 'medicine')
            ->whereHas('expense', function ($query) use ($request) {
                $query->whereBetween('date', [$request->start_date, $request->end_date]);
            })
            ->when($request->ward_id !== 'all', function ($query) use ($request) {
                $query->whereHas('expense', function ($query) use ($request) {
                    $query->where('ward_id', $request->ward_id);
                });
            })
            ->orderBy('date', 'desc')
            ->get();

        // Prepare the data
        $data = [];
        foreach ($records as $record) {
            $date = $record->expense->date;
            $ward = $record->expense->ward->ward_name;
            $medicine = $record->medicine->name;
            $quantity = $record->quantity;

            if (!isset($data[$date])) {
                $data[$date] = [
                    'Date' => $date,
                    'Ward' => $ward,
                    'Medicines' => [],
                ];
            }

            $data[$date]['Medicines'][] = "$medicine: $quantity";
        }

        // Flatten the data for export
        $exportData = [];
        foreach ($data as $date => $details) {
            $exportData[] = [
                'Date' => $details['Date'],
                'Ward' => $details['Ward'],
                'Medicines' => implode("\r\n", $details['Medicines']), // Use "\r\n" for new line in Excel
            ];
        }

        // Check if exportData is empty
        if (empty($exportData)) {
            return redirect()->back()->with('error', 'No records found for the given criteria.');
        }

        // Headers
        $headers = [
            'Date',
            'Ward',
            'Medicines',
        ];

        // Call to Export
        $filePath = $this->excelExportService->export($exportData, $headers, 'expense_records');

        // Return the file path
        return response()->download($filePath, 'expense_records.xlsx')->deleteFileAfterSend(true);
    }
}
