<?php

namespace App\Http\Controllers\drugDeptController;

use App\Http\Controllers\Controller;
use App\Models\Generic;
use App\Models\Medicine;
use App\Models\Medicine_log;
use App\Services\ExcelExportService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;
use App\Http\Resources\Drugdept\Medicine\MedicineResource;
use App\Http\Resources\Drugdept\Generic\GetGenericResource;

class MedicineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Medicine::query();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhereHas('generic', function ($q) use ($searchTerm) {
                        $q->where('generic_name', 'LIKE', "%{$searchTerm}%");
                    });
            });
        }

        $medicines = $query->orderBy('name')->paginate(25);
        $generics = Generic::select('id', 'generic_name')->where('generic_status', 1)->get();

        return Inertia::render('Drugdept/medicine/index', [
            'data' => MedicineResource::collection($medicines),
            'generics' => GetGenericResource::collection($generics),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function export()
    {
        return view('Drugdept.medicine.export');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable',
            'generic_id' => 'required|integer',
            'price' => 'nullable|integer',
            'quantity' => 'nullable|integer',
            'batch_no' => 'nullable|string|max:255',
            'strength' => 'nullable|string|max:255',
            'route' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'expiry_date' => 'date|nullable',
            'category' => 'nullable|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'status' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $path = null;
        $filename = null;
        if ($request->hasFile('med_image')) {
            $file = $request->file('med_image');
            $extension = $file->getClientOriginalExtension();
            $filename = time().'.'.$extension;
            $path = 'uploads/medicines/';
            $file->move($path, $filename);
        }

        try {
            Medicine::create([
                'name' => $request->name,
                'description' => $request->description,
                'generic_id' => $request->generic_id,
                'price' => $request->price,
                'quantity' => 0,
                'total_quantity' => 0,
                'batch_no' => $request->batch_no,
                'strength' => $request->strength,
                'route' => $request->route,
                'notes' => $request->notes,
                'expiry_date' => $request->expiry_date,
                'category' => $request->category,
                'manufacturer' => $request->manufacturer,
                'status' => $request->has('status') ? 1 : 0,
                'image' => $path.$filename,
            ]);

            return redirect()->back()->with('success', 'Medicine created successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            // Get SQL error message
            $errorMessage = $e->getMessage();

            // Redirect back with error message
            return redirect()->back()->with('error', $errorMessage);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Medicine $medicine)
    {
        $medicine = Medicine::with('generic')->find($medicine->id);
        return response()->json([
            'success' => true,
            'medicine' => $medicine,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Medicine $medicine)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable',
            'generic_id' => 'required|integer',
            'price' => 'nullable|integer',
            'batch_no' => 'nullable|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'strength' => 'nullable|string|max:255',
            'route' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'expiry_date' => 'date|nullable',
            'category' => 'nullable|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'status' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $path = $medicine->image;
        $filename = null;
        if ($request->hasFile('image')) {
            if (File::exists(public_path($medicine->image))) {
                File::delete(public_path($medicine->image));
            }
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename = time().'.'.$extension;
            $path = 'uploads/medicines/';
            $file->move($path, $filename);
        }

        try {
            $medicine->update([
                'name' => $request->name,
                'description' => $request->description,
                'generic_id' => $request->generic_id,
                'price' => $request->price,
                'batch_no' => $request->batch_no,
                'dosage' => $request->dosage,
                'strength' => $request->strength,
                'route' => $request->route,
                'notes' => $request->notes,
                'expiry_date' => $request->expiry_date,
                'category' => $request->category,
                'manufacturer' => $request->manufacturer,
                'status' => $request->has('status') ? 1 : 0,
                'image' => $path.$filename,
            ]);

            return redirect()->back()->with('success', 'Medicine updated successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            // Get SQL error message
            $errorMessage = $e->getMessage();

            // Redirect back with error message
            return redirect()->back()->with('error', $errorMessage);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Medicine $medicine)
    {
        if ($medicine->expenseRecords()->exists()) {
            return redirect()->back()->with('error', 'Medicine cannot be deleted because it has associated expense records.');
        }

        // Optionally, delete the image file from storage
        if (File::exists(public_path($medicine->image))) {
            File::delete(public_path($medicine->image));
        }
        $medicine->delete();

        return redirect('/medicines')->with('info', 'Medicine deleted successfully.');
    }

    public function total(Request $request)
    {
        $query = Medicine::query();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhereHas('generic', function ($q) use ($searchTerm) {
                        $q->where('generic_name', 'LIKE', "%{$searchTerm}%");
                    });
            });
        }

        $medicines = $query->orderBy('name')->paginate(25);

        return view('Drugdept.medicine.total', [
            'medicines' => $medicines,
        ]);
    }

    /**
     * View Logs of Spacific Medicine
     */
    public function logs(Medicine $medicine, Request $request)
    {
        $request->validate([
            'per_page' => 'nullable|integer',
            'page' => 'nullable|integer',
        ]);

        $per_page = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        $medicine = Medicine::with('generic')->find($medicine->id);
        $medicineLogs = Medicine_log::query()
            ->where('medicine_id', $medicine->id)
            ->orderBy('id', 'desc')
            ->skip(($page - 1) * $per_page)
            ->take($per_page)
            ->get();

        // Count total records for pagination info
        $totalLogs = Medicine_log::where('medicine_id', $medicine->id)->count();
        $hasMore = ($page * $per_page) < $totalLogs;

        return response()->json([
            'success' => true,
            'per_page' => $per_page,
            'current_page' => $page,
            'has_more' => $hasMore,
            'logs' => $medicineLogs,
        ]);
    }
    /**
     * Add stock to the specified medicine.
     */

    public function AddStock(Request $request, Medicine $medicine)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'log_type' => 'required|string|max:255',
            'expiry_date' => 'nullable|date',
            'date' => 'required|date',
            'notes' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            $quantity = $request->quantity;

            if ($request->log_type === 'approve') {
                $medicine->increment('quantity', $quantity);
                $medicine->total_quantity = ($medicine->total_quantity ?? 0) + $quantity;

                if ($request->filled('expiry_date')) {
                    $medicine->expiry_date = $request->expiry_date;
                }
            } elseif ($request->log_type === 'return') {
                if ($medicine->quantity < $quantity) {
                    return redirect()->back()->with('error', 'Cannot return more stock than available.');
                }

                $medicine->decrement('quantity', $quantity);
                $medicine->total_quantity = max(($medicine->total_quantity ?? 0) - $quantity, 0);
            } else {
                return redirect()->back()->with('error', 'Invalid log type.');
            }

            $medicine->save();

            Medicine_log::create([
                'log_type' => $request->log_type,
                'medicine_id' => $medicine->id,
                'quantity' => $quantity,
                'date' => $request->date,
                'notes' => $request->notes,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Stock updated successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Database error: ' . $e->getMessage());
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Unexpected error: ' . $e->getMessage());
        }
    }

    protected $excelExportService;

    public function __construct(ExcelExportService $excelExportService)
    {
        $this->excelExportService = $excelExportService;
    }

    public function exportToExcel(Request $request)
    {
        $request->validate([
            'status' => 'nullable|string',
            'excludeZero' => 'nullable|string',
        ]);

        // Fetch your data with the associated generic name
        $medicines = Medicine::with('generic:id,generic_name') // Optimize the relationship query
            ->select('id', 'name', 'category', 'route', 'generic_id', 'quantity', 'total_quantity', 'status', 'expiry_date');

        // Apply filters
        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'active') {
                $medicines->where('status', 1);
            } elseif ($status === 'inactive') {
                $medicines->where('status', 0);
            }
        }
        if ($request->has('excludeZero') && $request->input('excludeZero') === 'true') {
            $medicines->where('quantity', '>', 0);
        }

        $medicines = $medicines->orderBy('name')->get();

        // Prepare the data
        $data = [];
        foreach ($medicines as $medicine) {
            $data[] = [
                'name' => $medicine->name,
                'category' => $medicine->category,
                'route' => $medicine->route,
                'generic_name' => $medicine->generic->generic_name ?? 'N/A', // Handle potential null
                'expiry_date' => Carbon::parse($medicine->expiry_date)->format('d-m-Y'),
                'quantity' => $medicine->quantity,
                'total_quantity' => $medicine->total_quantity,
                'status' => $medicine->status == 1 ? 'Active' : 'Inactive',
                'used' => $medicine->getTotalUsedAttribute(), // Ensure this is efficient
            ];
        }

        // Define the headers for the Excel file
        $headers = ['Medicine Name', 'Category', 'Route', 'Generic Name', 'Expiry Date', 'Quantity', 'Total Quantity', 'Status', 'Used'];

        // Call the export service
        $filePath = $this->excelExportService->export($data, $headers, 'medicines.xlsx');

        // Return the file as a download response
        return Response::download($filePath, 'medicines_' . date('Y-m-d') . '.xlsx')->deleteFileAfterSend(true);
    }

    /**
     * Search for medicines.
     */
    public function search(Request $request)
    {
        try {
            $search = trim($request->get('q'));

            // Base query with eager loading
            $query = Medicine::query()
                ->with(['generic'])
                ->where('status', 1)
                ->orderBy('name', 'asc');

            // Apply search conditions if search term exists
            if ($search) {
                $searchTerm = '%'.$search.'%';

                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', $searchTerm)
                        ->orWhere('category', 'LIKE', $searchTerm)
                        ->orWhere('route', 'LIKE', $searchTerm)
                        ->orWhereHas('generic', function ($q) use ($searchTerm) {
                            $q->where('generic_name', 'LIKE', $searchTerm);
                        });
                });
            }

            $medicines = $query->paginate(30);

            // Transform the results
            $transformedItems = $medicines->map(function ($medicine) {
                $genericName = $medicine->generic->generic_name ?? 'N/A';

                return [
                    'id' => $medicine->id,
                    'text' => $this->formatMedicineText($medicine, $genericName),
                    'value' => $medicine->id, // Add value field for react-select
                    'label' => $this->formatMedicineText($medicine, $genericName), // Add label field for react-select
                    'medicine_name' => $medicine->name,
                    'generic_name' => $genericName,
                    'category' => $medicine->category ?? 'N/A',
                    'strength' => $medicine->strength ?? 'N/A',
                    'route' => $medicine->route ?? 'N/A',
                ];
            });

            return response()->json([
                'success' => true,
                'items' => $transformedItems,
                'total_count' => $medicines->total(),
                'current_page' => $medicines->currentPage(),
                'per_page' => $medicines->perPage(),
            ]);
        } catch (\Exception $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while searching medicines',
            ], 500);
        }
    }

    // Make sure you have this helper method defined in your controller
    private function formatMedicineText($medicine, $genericName)
    {
        return sprintf(
            "%s (%s) - %s (%s) - %s",
            $medicine->name,
            $genericName,
            $medicine->category ?? 'N/A',
            $medicine->strength ?? 'N/A',
            $medicine->route ?? 'N/A'
        );
    }

}
