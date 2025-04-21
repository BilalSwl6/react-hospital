<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('wards')->insert([
            [
                'ward_name' => 'Peads-Surgury',
                'ward_description' => 'Peads-Surgury Ward',
                'ward_capacity' => null,
                'ward_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ward_name' => 'Orthopedic Surgery',
                'ward_description' => 'Orthopedic Surgery Ward',
                'ward_capacity' => null,
                'ward_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ward_name' => 'Surgical-1',
                'ward_description' => 'Surgical-1 Ward',
                'ward_capacity' => null,
                'ward_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ward_name' => 'Surgical-2',
                'ward_description' => 'Surgical-2 Ward',
                'ward_capacity' => null,
                'ward_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ward_name' => 'Surgical-3',
                'ward_description' => 'Surgical-3 Ward',
                'ward_capacity' => null,
                'ward_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ward_name' => 'Surgical-ICU',
                'ward_description' => 'Surgical-ICU Ward',
                'ward_capacity' => null,
                'ward_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ward_name' => 'Eye-1',
                'ward_description' => 'Eye-1 Ward',
                'ward_capacity' => null,
                'ward_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ward_name' => 'Eye-2',
                'ward_description' => 'Eye-2 Ward',
                'ward_capacity' => null,
                'ward_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ward_name' => 'Urology',
                'ward_description' => 'Urology Ward',
                'ward_capacity' => null,
                'ward_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ward_name' => 'ENT',
                'ward_description' => 'ENT Ward',
                'ward_capacity' => null,
                'ward_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ward_name' => 'Neuro-Surgery',
                'ward_description' => 'Neuro-Surgery Ward',
                'ward_capacity' => null,
                'ward_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
