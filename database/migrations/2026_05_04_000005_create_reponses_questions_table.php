<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reponses_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reponse_sondage_id')->constrained('reponses_sondages')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('questions_sondages')->cascadeOnDelete();
            $table->foreignId('option_id')->nullable()->constrained('options_questions')->nullOnDelete();
            $table->text('texte')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reponses_questions');
    }
};
