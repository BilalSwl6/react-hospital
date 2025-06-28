<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('db_backup_records', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique()->comment('The date of the backup');
            $table->string('file_name')->comment('The name of the backup file');
            $table->enum('status', ['pending', 'started', 'completed', 'failed'])
                ->default('pending')
                ->comment('The status of the backup process');
            $table->text('error_message')->nullable()->comment('Error message if the backup failed');
            $table->timestamp('completed_at')->nullable()->comment('Timestamp when the backup was completed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('db_backup_records');
    }
};
