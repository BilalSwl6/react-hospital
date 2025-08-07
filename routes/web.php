<?php

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use App\Http\Controllers\drugDeptController\WardController;
use App\Http\Controllers\drugDeptController\ExpenseController;
use App\Http\Controllers\drugDeptController\GenericController;
use App\Http\Controllers\drugDeptController\DrugDeptController;
use App\Http\Controllers\drugDeptController\MedicineController;
use App\Http\Controllers\drugDeptController\ExpenseRecordController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/api/dashboard', [DrugDeptController::class, 'dashboard'])->name('dashboard.api');

    Route::get('/wards/search', [WardController::class, 'search'])->name('wards.search');
    Route::resource('wards', WardController::class);
    Route::get('/medicines/search', [MedicineController::class, 'search'])->name('medicines.search');
    Route::get('medicines/total', [MedicineController::class, 'total'])->name('medicines.total');
    Route::get('medicines/{medicine}/logs', [MedicineController::class, 'logs'])->name('medicines.logs');
    Route::post('/medicines/{medicine}/add-stock', [MedicineController::class, 'AddStock'])->name('medicines.addStock');
    Route::get('medicines/export', [MedicineController::class, 'export'])->name('medicines.export');
    Route::post('medicines/export-to-excel', [MedicineController::class, 'exportToExcel'])->name('medicines.export-to-excel');
    Route::resource('medicines', MedicineController::class);
    Route::resource('generics', GenericController::class);
    Route::resource('expenseRecord', ExpenseRecordController::class)->except(['create', 'edit']);
    Route::post('expense/export-to-excel', [ExpenseController::class, 'exportToExcel'])->name('expense.export-to-excel');
    Route::get('expense/export', [ExpenseController::class, 'ExportExcelView'])->name('expense.export');
    Route::resource('expense', ExpenseController::class);
    Route::get('expenseRecord/create/{expense_id}', [ExpenseRecordController::class, 'create'])->name('expenseRecord.create');
    Route::put('expenseRecord/{id}', [ExpenseRecordController::class, 'update'])->name('expenseRecord.update');
    Route::delete('expenseRecord/{id}', [ExpenseRecordController::class, 'destroy'])->name('expenseRecord.destroy');

    Route::get('shortcuts/', function () {
        return Inertia::render('shortcut');
    })->name('shortcut');

});



Route::get('/reset-demo', function () {
    abort_unless(app()->environment(['local', 'demo']), 403);

    DB::transaction(function () {
        // 1. Remove all roles & permissions from users
        foreach (User::all() as $user) {
            $user->syncRoles([]);
            $user->syncPermissions([]);
        }

        // 2. Forget cached permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 3. Delete all role/permission pivot data and actual roles/permissions
        DB::table('model_has_permissions')->delete();
        DB::table('model_has_roles')->delete();
        DB::table('role_has_permissions')->delete();
        DB::table('permissions')->delete();
        DB::table('roles')->delete();

        // 4. Re-seed permissions and roles
        Artisan::call('db:seed', [
            '--class' => 'PermissionSeeder',
            '--force' => true,
        ]);

        // 5. Create or update demo users with roles
        $demoUsers = [
            [
                'name' => 'Admin',
                'email' => 'admin@mail.com',
                'role' => 'admin',
            ],
            [
                'name' => 'Pharmacy Technician',
                'email' => 'pharmacy@mail.com',
                'role' => 'pharmacy-technician',
            ],
            [
                'name' => 'Standard User',
                'email' => 'user@mail.com',
                'role' => 'user',
            ],
        ];

        foreach ($demoUsers as $demo) {
            $user = User::updateOrCreate(
                ['email' => $demo['email']],
                [
                    'name' => $demo['name'],
                    'password' => Hash::make('12345678'),
                ]
            );

            $user->syncRoles([$demo['role']]);
        }
    });

    return '✅ Demo users reset. Roles/permissions cleaned & re-seeded.';
});
