<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'allow.always',
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
            'medicine.stock',
            'medicine.viewLog',
            'medicine.export',
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
            'doctor.view',
            'doctor.create',
            'doctor.edit',
            'doctor.delete',
            'doctor.Appointment-view',
            'doctor.Appointment-create',
            'doctor.Appointment-edit',
            'doctor.Appointment-delete',
            'doctor.schedule-create',
            'doctor.schedule-view',
            'doctor.schedule-edit',
            'doctor.schedule-delete',
            'nurse.view',
            'nurse.create',
            'nurse.edit',
            'nurse.delete',
            'core.backup',
            'core.setting',
            'core.mailing',
        ];

        foreach ($permissions as $key => $value) {
            Permission::create(['name' => $value]);
        }

        $roles = [
            'admin',
            'doctor',
            'nurse',
            'receptionist-opd',
            'patient',
            'pharmacy-technician',
            'hr',
            'audit',
            'accounting',
            'security',
            'intern',
            'lab-technician',
            'radiology-technician',
            'insurence',
            'blood-bank',
            'receptionist-emergency',
            'DMS',
            'OTA',
            'employ',
            'user'
        ];

        foreach ($roles as $value) {
            $role = Role::firstOrCreate(['name' => $value]);

            if ($role->name === 'admin') {
                $role->givePermissionTo(Permission::all());
            } else {
                $role->givePermissionTo('allow.always');
            }
        }

        // Add Spacific permissions to spacific roles
        // Role 1 - Pharmacy Technician
        $role1 = Role::firstOrCreate(['name' => 'pharmacy-technician']);
        $pharmacy_technician = ['ward.view', 'generic.view', 'generic.create', 'generic.edit', 'medicine.view', 'medicine.create', 'medicine.edit', 'medicine.stock', 'medicine.viewLog', 'expense.view', 'expense.create', 'expense.edit', 'expenseRecord.view', 'expenseRecord.create'];
        $role1->givePermissionTo($pharmacy_technician);

        // Role 2 - Patient
        $role2 = Role::firstOrCreate(['name'=> 'patient']);
        $patient = ['ward.view', 'patient.view', 'patient.edit', 'doctor.view'];
        $role2->givePermissionTo($patient);

        // Role 3 - demo/user
        $role3 = Role::firstOrCreate(['name'=> 'user']);
        $user = ['ward.view', 'patient.view', 'doctor.view', 'expenseRecord.view', 'user.view', 'role.view', 'ward.view', 'generic.view', 'medicine.view', 'medicine.viewLog' ];
        $role3->givePermissionTo($user);

        // i will add more roles time to time
    }
}
