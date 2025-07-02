<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\DbBackupRecord;

class DbBackupRecordFactory extends Factory
{
    protected $model = DbBackupRecord::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => $this->faker->unique()->date(),
            'file_name' => $this->faker->lexify('backup_??????.zip'),
            'created_at' => now(),
            'updated_at' => now(),
            'file_size' => $this->faker->numberBetween(1000, 999999), // in bytes
            'status' => $this->faker->randomElement([
                DbBackupRecord::STATUS_PENDING,
                DbBackupRecord::STATUS_RUNNING,
                DbBackupRecord::STATUS_COMPLETED,
                DbBackupRecord::STATUS_FAILED,
            ]),
            'error_message' => $this->faker->optional()->sentence(),
            'started_at' => $this->faker->optional()->dateTimeThisYear(),
            'completed_at' => $this->faker->optional()->dateTimeThisYear(),
        ];
    }
}
