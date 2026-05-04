<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('options_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('questions_sondages')->cascadeOnDelete();
            $table->string('texte');
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('options_questions');
    }
};
