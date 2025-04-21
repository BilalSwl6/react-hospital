<?php

namespace App\Http\Controllers\drugDeptController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Expense;
use App\Models\ExpenseRecord;
use App\Models\Medicine;
use App\Models\Generic;
use Illuminate\Support\Facades\DB;

class ExpenseRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Implement the index method if needed
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $expense = Expense::findOrFail($request->expense_id);
        $message = request('success');
        $expense_id = request('expense_id');
        $medicines = Medicine::where('status', 1)->where('quantity', '>', 0)->orderBy('name')->get();
        $generics = Generic::all();

        return view('drugDept.expense.createRecord', compact('message', 'expense', 'expense_id', 'medicines', 'generics'));
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'expense_id' => 'required|exists:expenses,id',
            'medicine_id' => 'required|array',
            'medicine_id.*' => 'required|exists:medicines,id',
            'medicine_name.*' => 'required|string',
            'generic_name.*' => 'required|string',
            'quantity.*' => 'required|integer|min:1',
        ]);

        try {
            // Iterate over each medicine_id and create an ExpenseRecord
            foreach ($request->medicine_id as $index => $medicine_id) {
                // Create an ExpenseRecord
                ExpenseRecord::create([
                    'expense_id' => $request->expense_id,
                    'medicine_id' => $medicine_id,
                    'medicine_name' => $request->medicine_name[$index],
                    'generic_name' => $request->generic_name[$index],
                    'quantity' => $request->quantity[$index],
                ]);

                // Subtract the quantity from the Medicine model
                $medicine = Medicine::find($medicine_id);
                if ($medicine) {
                    $medicine->quantity -= $request->quantity[$index];
                    $medicine->save();
                }
            }

            // Redirect back to the expense list with a success message
            return redirect()->route('expense.index')->with('success', 'Expense records created and quantities updated successfully');
        } catch (\Exception $e) {
            // Handle errors and redirect back with an error message
            return redirect()->back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $expenseRecord = ExpenseRecord::findOrFail($id);
            $medicine = Medicine::findOrFail($expenseRecord->medicine_id);

            $oldQuantity = $expenseRecord->quantity;
            $newQuantity = $request->quantity;

            // Calculate the difference
            $quantityDifference = $newQuantity - $oldQuantity;

            // Check if we have enough medicine in stock
            if ($medicine->quantity < $quantityDifference) {
                throw new \Exception("Not enough medicine in stock. Available: {$medicine->quantity}");
            }

            // Update the ExpenseRecord
            $expenseRecord->update([
                'quantity' => $newQuantity,
            ]);

            // Update the Medicine quantity
            $medicine->quantity -= $quantityDifference;
            $medicine->save();

            DB::commit();

            return redirect()->back()->with('success', 'Quantity updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $expenseRecord = ExpenseRecord::findOrFail($id);
            $medicine = Medicine::findOrFail($expenseRecord->medicine_id);

            // Return the quantity to the medicine stock
            $medicine->quantity += $expenseRecord->quantity;
            $medicine->save();

            $expenseRecord->delete();

            DB::commit();

            return redirect()->back()->with('info', 'Record deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }
}
