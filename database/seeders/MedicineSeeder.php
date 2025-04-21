<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('medicines')->insert([
            [
                'name' => 'Tramax',
                'description' => 'Very Good Pain Killer',
                'generic_id' => 4,
                'quantity' => 100,
                'price' => 54,
                'batch_no' => 'PC061',
                'dosage' => '100mg/2ml',
                'strength' => '100mg',
                'route' => 'Intravenous',
                'notes' => null,
                'expiry_date' => 2025-07-31,
                'manufacturer' => 'PharmaSol Private Limited',
                'status' => 1,
                'image' => null,
            ],
            [
                'name' => 'Ame-Clop',
                'description' => null,
                'generic_id' => 3,
                'quantity' => 100,
                'price' => 13,
                'batch_no' => 'MC-110',
                'dosage' => '10mg/2ml',
                'strength' => '10mg',
                'route' => 'Intravenous',
                'notes' => null,
                'expiry_date' => 2026-04-30,
                'manufacturer' => 'Ameer Pharma Private Limited',
                'status' => 1,
                'image' => null,
            ],
            [
                'name' => 'Hicartif',
                'description' => null,
                'generic_id' => 5,
                'quantity' => 100,
                'price' => 213,
                'batch_no' => 'HG142',
                'dosage' => '250mg/2ml',
                'strength' => null,
                'route' => 'Intravenous',
                'notes' => null,
                'expiry_date' => 2026-02-01,
                'manufacturer' => 'PharmaSol Private Limited',
                'status' => 1,
                'image' => null,
            ],
            [
                'name' => 'Gotec',
                'description' => 'PPI',
                'generic_id' => 1,
                'quantity' => 100,
                'price' => 470,
                'batch_no' => 'GT-077',
                'dosage' => '40mg/1Vial',
                'strength' => '40mg',
                'route' => 'Intravenous',
                'notes' => null,
                'expiry_date' => 2026-06-30,
                'manufacturer' => 'MTI Medical',
                'status' => 1,
                'image' => null,
            ],
            [
                'name' => 'DEXAPRO',
                'description' => 'Steroid',
                'generic_id' => 2,
                'quantity' => 100,
                'price' => 20,
                'batch_no' => 'EG127',
                'dosage' => '4mg/1ml',
                'strength' => '4mg',
                'route' => 'Intravenous',
                'notes' => null,
                'expiry_date' => 2025-07-31,
                'manufacturer' => 'PharmaSol Private Limited',
                'status' => 1,
                'image' => null,
            ],
            [
                'name' => 'Heumatic',
                'description' => 'Diclo',
                'generic_id' => 7,
                'quantity' => 100,
                'price' => 50,
                'batch_no' => 'PC061',
                'dosage' => '75mg/3ml',
                'strength' => '25mg',
                'route' => 'Intramuscular',
                'notes' => null,
                'expiry_date' => 2026-01-31,
                'manufacturer' => 'Neutro Pharma Private Limited',
                'status' => 1,
                'image' => null,
            ],
            [
                'name' => 'Cytozon',
                'description' => 'Ceftrixone',
                'generic_id' => 6,
                'quantity' => 100,
                'price' => 535,
                'batch_no' => 'CT-360',
                'dosage' => '1g/vial',
                'strength' => '1g',
                'route' => 'Intravenous',
                'notes' => null,
                'expiry_date' => 2021-01-31,
                'manufacturer' => 'MTI Medical',
                'status' => 1,
                'image' => null,
            ],
        ]);
        }
}