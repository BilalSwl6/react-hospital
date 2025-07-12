<?php

namespace Database\Factories;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseFactory extends Factory
{
    protected $model = Expense::class;

    protected static $usedCombinations = [];

    public function definition(): array
    {
        // Try 10 times to generate a unique date + ward_id combo
        for ($i = 0; $i < 10; $i++) {
            $date = $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d');
            $wardId = $this->faker->numberBetween(1, 11);
            $combo = $date . '-' . $wardId;

            if (!in_array($combo, self::$usedCombinations)) {
                self::$usedCombinations[] = $combo;

                return [
                    'date' => $date,
                    'ward_id' => $wardId,
                    'note' => $this->faker->sentence(),
                    'user_id' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // If unique combo can't be found, throw exception or return fallback
        throw new \Exception('Could not generate unique (date, ward_id) combo');
    }
}
