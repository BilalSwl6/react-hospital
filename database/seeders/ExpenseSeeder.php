<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ExpenseSeeder extends Seeder
{
    public function run(): void
    {
        $baseDate = Carbon::now();

        for ($ward = 1; $ward <= 4; $ward++) {
            $date = $baseDate->copy()->addDays($ward)->toDateString();

            $exists = DB::table('expenses')
                ->where('date', $date)
                ->where('ward_id', $ward)
                ->exists();

            if (!$exists) {
                DB::table('expenses')->insert([
                    'date' => $date,
                    'ward_id' => $ward,
                    'note' => "Monthly expense for ward $ward",
                    'user_id' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
