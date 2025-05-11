<?php

namespace Database\Seeders;

/*use Illuminate\Database\Console\Seeds\WithoutModelEvents;*/
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('expenses')->insert([
            [
                'date' => now(),
                'ward_id' => 1,
                'note' => 'Monthly expense for ward 1',
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'date' => now(),
                'ward_id' => 2,
                'note' => 'Monthly expense for ward 2',
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'date' => now(),
                'ward_id' => 3,
                'note' => 'Monthly expense for ward 3',
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'date' => now(),
                'ward_id' => 4,
                'note' => 'Monthly expense for ward 4',
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
