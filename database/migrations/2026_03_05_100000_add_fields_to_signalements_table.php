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
        Schema::table('signalements', function (Blueprint $table) {
            $table->enum('category', ['voirie', 'eclairage', 'proprete', 'autre'])->default('autre')->after('description');
            $table->enum('status', ['enregistre', 'en_cours', 'resolu'])->default('enregistre')->after('category');
            $table->string('location')->nullable()->after('status');
            $table->decimal('latitude', 10, 8)->nullable()->after('location');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->string('photo')->nullable()->after('longitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('signalements', function (Blueprint $table) {
            $table->dropColumn(['category', 'status', 'location', 'latitude', 'longitude', 'photo']);
        });
    }
};
