<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GenericSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('generics')->insert([
            [
                'generic_name' => 'Omeprazole',
                'generic_description' => 'Most Papular PPI',
                'generic_status' => 1,
                'generic_notes' => null,
                'generic_category' => 'Proton pump inhibitor (PPI)',
                'generic_subcategory' => null,
                'therapeutic_class' => 'Proton-pump inhibitor (PPI) class',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'generic_name' => 'Dexamethasone',
                'generic_description' => 'Dexamethasone is a corticosteroid that prevents the release of substances in the body that cause inflammation',
                'generic_status' => 1,
                'generic_notes' => "Steroid",
                'generic_category' => 'Corticosteroid',
                'generic_subcategory' => null,
                'therapeutic_class' => 'Corticosteroid',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'generic_name' => 'Metoclopramide HCl',
                'generic_description' => 'Metoclopramide is a medication used for stomach and esophageal problems. It is commonly used to treat and prevent nausea and vomiting, to help with emptying of the stomach in people with delayed stomach emptying, and to help with gastroesophageal reflux disease.',
                'generic_status' => 1,
                'generic_notes' => null,
                'generic_category' => 'Dopamine-receptor antagonists',
                'generic_subcategory' => null,
                'therapeutic_class' => 'Antiemetics and prokinetics',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'generic_name' => 'Tramadol',
                'generic_description' => 'Tramadol, sold under the brand name Ultram among others, is an opioid pain medication and a serotonin–norepinephrine reuptake inhibitor (SNRI) used to treat moderately severe pain.',
                'generic_status' => 1,
                'generic_notes' => null,
                'generic_category' => 'Pain-Killer',
                'generic_subcategory' => null,
                'therapeutic_class' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'generic_name' => 'hydrocortisone sodium succinate',
                'generic_description' => 'Hydrocortisone sodium succinate is a synthetic glucocorticoid corticosteroid used to treat various conditions such as arthritis, severe allergies, blood diseases, breathing problems, certain cancers, eye diseases, intestinal disorders, and skin diseases.',
                'generic_status' => 1,
                'generic_notes' => null,
                'generic_category' => 'Corticosteroid',
                'generic_subcategory' => null,
                'therapeutic_class' => 'Corticosteroid',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'generic_name' => 'Ceftriaxone',
                'generic_description' => 'Ceftriaxone, sold under the brand name Rocephin, is a third-generation cephalosporin antibiotic used for the treatment of a number of bacterial infections.',
                'generic_status' => 1,
                'generic_notes' => null,
                'generic_category' => 'Antibiotic',
                'generic_subcategory' => null,
                'therapeutic_class' => 'Cephalosporins',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'generic_name' => 'Diclofenac Sodium',
                'generic_description' => 'Diclofenac is a nonsteroidal anti-inflammatory drug (NSAID). This medicine works by reducing substances in the body that cause pain and inflammation.',
                'generic_status' => 1,
                'generic_notes' => null,
                'generic_category' => 'Pain-Killer',
                'generic_subcategory' => null,
                'therapeutic_class' => 'Nonsteroidal anti-inflammatory drug',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
