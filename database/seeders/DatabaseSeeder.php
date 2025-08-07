<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\DbBackupRecord;
use App\Models\Expense;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();
        if (!User::where('email', 'admin@mail.com')->exists()) {
            $this->call([
                WardSeeder::class,
                GenericSeeder::class,
                MedicineSeeder::class,
                PermissionSeeder::class,
            ]);

            DbBackupRecord::factory(5)->create();
            Expense::factory(20)->create();

            $this->call([
                ExpenseRecordSeeder::class,
            ]);

            $user = User::factory()->create([
                'name' => 'Test Admin',
                'email' => 'admin@mail.com',
                'password' => bcrypt('12345678'),
            ]);
            // Assign admin role properly
            $user->assignRole('admin');

            $user1 = User::factory()->create([
                'name' => 'Test Pharmacy',
                'email' => 'pharmacy@mail.com',
                'password' => bcrypt('12345678'),
            ]);
            // Assign pharmacy-technician role properly
            $user1->assignRole('pharmacy-technician');

            $user2 = User::factory()->create([
                'name' => 'Test User',
                'email' => 'user@mail.com',
                'password' => bcrypt('12345678'),
            ]);
            // Assign pharmacy-technician role properly
            $user2->assignRole('user');
        }
    }
}
