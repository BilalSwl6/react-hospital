<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class ExpenseRecordSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $records = [
            // Expense 1
            ['expense_id' => 1, 'medicine_id' => 1, 'generic_name' => 'Painkiller', 'medicine_name' => 'Tramax', 'quantity' => 10, 'created_at' => $now, 'updated_at' => $now],
            ['expense_id' => 1, 'medicine_id' => 2, 'generic_name' => 'NSAID', 'medicine_name' => 'Ame-Clop', 'quantity' => 5, 'created_at' => $now, 'updated_at' => $now],
            ['expense_id' => 1, 'medicine_id' => 3, 'generic_name' => 'Antibiotic', 'medicine_name' => 'Hicartif', 'quantity' => 8, 'created_at' => $now, 'updated_at' => $now],

            // Expense 2
            ['expense_id' => 2, 'medicine_id' => 2, 'generic_name' => 'NSAID', 'medicine_name' => 'Ame-Clop', 'quantity' => 7, 'created_at' => $now, 'updated_at' => $now],
            ['expense_id' => 2, 'medicine_id' => 4, 'generic_name' => 'PPI', 'medicine_name' => 'Gotec', 'quantity' => 12, 'created_at' => $now, 'updated_at' => $now],
            ['expense_id' => 2, 'medicine_id' => 5, 'generic_name' => 'Steroid', 'medicine_name' => 'DEXAPRO', 'quantity' => 6, 'created_at' => $now, 'updated_at' => $now],

            // Expense 3
            ['expense_id' => 3, 'medicine_id' => 3, 'generic_name' => 'Antibiotic', 'medicine_name' => 'Hicartif', 'quantity' => 15, 'created_at' => $now, 'updated_at' => $now],
            ['expense_id' => 3, 'medicine_id' => 6, 'generic_name' => 'NSAID', 'medicine_name' => 'Heumatic', 'quantity' => 9, 'created_at' => $now, 'updated_at' => $now],

            // Expense 4
            ['expense_id' => 4, 'medicine_id' => 1, 'generic_name' => 'Painkiller', 'medicine_name' => 'Tramax', 'quantity' => 11, 'created_at' => $now, 'updated_at' => $now],
            ['expense_id' => 4, 'medicine_id' => 4, 'generic_name' => 'PPI', 'medicine_name' => 'Gotec', 'quantity' => 14, 'created_at' => $now, 'updated_at' => $now],
            ['expense_id' => 4, 'medicine_id' => 7, 'generic_name' => 'Antibiotic', 'medicine_name' => 'Cytozon', 'quantity' => 10, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('expense_record')->insert($records);
    }
}
