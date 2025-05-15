<?php

namespace App\Http\Controllers\drugDeptController;

use App\Http\Controllers\Controller;
use App\Models\ExpenseRecord;
use App\Models\Expense;
use App\Models\Medicine;

class DrugDeptController extends Controller
{
    public function indent()
    {
        return 'Drug Dept';
    }

    public function dashboard()
{
    $AvailableMedicines = Medicine::where('quantity', '>', 0)->count();

    $TodayExpenseRecord = Expense::whereDate('date', now())->get();

    $MostUsedMedicines = Medicine::withCount('expenseRecords')
        ->where('generic_id', '!=', 8) // exclude generic_id = 7
        ->orderBy('expense_records_count', 'desc')
        ->take(5)
        ->get();

    $NearExpiryMedicines = Medicine::where('expiry_date', '<=', now()->addDays(30))
        ->where('quantity', '>', 0)
        ->get();

    return response()->json([
        'AvailableMedicines' => $AvailableMedicines,
        'TodayExpense' => $TodayExpenseRecord,
        'MostUsedMedicines' => $MostUsedMedicines,
        'NearExpiryMedicines' => $NearExpiryMedicines,
    ]);
}

}
