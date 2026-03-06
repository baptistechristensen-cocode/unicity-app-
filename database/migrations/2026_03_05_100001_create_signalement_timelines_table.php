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
        Schema::create('signalement_timelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('signalement_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['enregistre', 'en_cours', 'resolu']);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('signalement_timelines');
    }
};
