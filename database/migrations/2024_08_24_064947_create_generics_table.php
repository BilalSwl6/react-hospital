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
        Schema::create('generics', function (Blueprint $table) {
            $table->id();
            $table->string('generic_name')->unique();
            $table->string('generic_description')->nullable();
            $table->boolean('generic_status')->default(1);
            $table->string('generic_notes')->nullable();
            $table->string('generic_category')->nullable();
            $table->string('generic_subcategory')->nullable();
            $table->string('therapeutic_class')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generics');
    }
};
