<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class ExpenseRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('expense_record')->insert([
            [
                'expense_id' => 1,
                'medicine_id' => 1,
                'generic_name' => 'Monthly expense for ward 1',
                'medicine_name' => 'Paracetam',
                'quantity' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'expense_id' => 1,
                'medicine_id' => 2,
                'generic_name' => 'Monthly expense for ward 1',
                'medicine_name' => 'Ibuprofen',
                'quantity' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'expense_id' => 2,
                'medicine_id' => 3,
                'generic_name' => 'Monthly expense for ward 2',
                'medicine_name' => 'Aspirin',
                'quantity' => 15,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'expense_id' => 3,
                'medicine_id' => 4,
                'generic_name' => 'Monthly expense for ward 3',
                'medicine_name' => 'Amoxicillin',
                'quantity' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
