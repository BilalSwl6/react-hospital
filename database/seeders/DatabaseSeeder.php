<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Expense;
use App\Models\DbBackupRecord;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        if (!User::where('email', 'admin@mail.com')->exists()) {

            User::factory()->create([
                'name' => 'Test User',
                'email' => 'admin@mail.com',
                'password' => bcrypt('12345678'),
            ]);
            $this->call([
                WardSeeder::class,
                GenericSeeder::class,
                MedicineSeeder::class,
            ]);

            DbBackupRecord::factory(5)->create();
            Expense::factory(20)->create();


            $this->call([
                ExpenseRecordSeeder::class,
            ]);
        }

    }
}
