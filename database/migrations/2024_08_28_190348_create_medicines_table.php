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
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->foreignId('generic_id')->constrained('generics')->cascadeOnDelete();
            $table->integer('quantity')->nullable();
            $table->integer('price')->nullable()->default(0);
            $table->string('batch_no')->nullable();
            $table->string('dosage')->nullable();
            $table->string('strength')->nullable();
            $table->string('route')->nullable();
            $table->string('notes')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('category')->nullable();
            $table->string('manufacturer')->nullable();
            $table->boolean('status')->default(1)->comment('1=Active, 0=Inactive');
            $table->string('image')->nullable();
            $table->timestamps();

            // Add index for better performance on foreign key column
            $table->index('generic_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
