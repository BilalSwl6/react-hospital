<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',
            'role.view',
            'role.create',
            'role.edit',
            'role.delete',
            'permission.view',
            'permission.create',
            'permission.edit',
            'permission.delete',
            'ward.view',
            'ward.create',
            'ward.edit',
            'ward.delete',
            'generic.view',
            'generic.create',
            'generic.edit',
            'generic.delete',
            'medicine.view',
            'medicine.create',
            'medicine.edit',
            'medicine.delete',
            'patient.view',
            'patient.create',
            'patient.edit',
            'patient.delete',
            'expense.view',
            'expense.create',
            'expense.edit',
            'expense.delete',
            'expenseRecord.view',
            'expenseRecord.create',
            'expenseRecord.edit',
            'expenseRecord.delete',
        ];

        foreach ($permissions as $key => $value) {
            Permission::create(['name' => $value]);
        }
    }
}
