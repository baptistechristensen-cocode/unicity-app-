<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions_sondages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sondage_id')->constrained('sondages')->cascadeOnDelete();
            $table->text('texte');
            $table->string('type')->default('radio'); // radio, checkbox, texte
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions_sondages');
    }
};
