<?php

use App\Http\Controllers\drugDeptController\ExpenseController;
use App\Http\Controllers\drugDeptController\ExpenseRecordController;
use App\Http\Controllers\drugDeptController\GenericController;
use App\Http\Controllers\drugDeptController\MedicineController;
use App\Http\Controllers\drugDeptController\WardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/wards/search', [WardController::class, 'search'])->name('wards.search');
    Route::resource('wards', WardController::class);
    Route::get('/medicines/search', [MedicineController::class, 'search'])->name('medicines.search');
    Route::get('medicines/total', [MedicineController::class, 'total'])->name('medicines.total');
    Route::get('medicines/{medicine}/logs', [MedicineController::class, 'logs'])->name('medicines.logs');
    Route::post('/medicines/{medicine}/add-stock', [MedicineController::class, 'AddStock'])->name('medicines.addStock');
    Route::post('medicines/export-to-excel', [MedicineController::class, 'exportToExcel'])->name('medicines.export-to-excel');
    Route::resource('medicines', MedicineController::class);
    Route::resource('generics', GenericController::class);
    Route::resource('expenseRecord', ExpenseRecordController::class);
    Route::post('expense/export-to-excel', [ExpenseController::class, 'exportToExcel'])->name('expense.export-to-excel');
    Route::get('expense/export', [ExpenseController::class, 'ExportExcelView' ])->name('expense.export');
    Route::resource('expense', ExpenseController::class);
    Route::get('expenseRecord/create/{expense_id}', [ExpenseRecordController::class, 'create'])->name('expenseRecord.create');
    Route::put('expenseRecord/{id}', [ExpenseRecordController::class, 'update'])->name('expenseRecord.update');
    Route::delete('expenseRecord/{id}', [ExpenseRecordController::class, 'destroy'])->name('expenseRecord.destroy');
});
