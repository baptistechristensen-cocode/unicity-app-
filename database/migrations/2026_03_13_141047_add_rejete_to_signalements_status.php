<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite ne supporte pas ALTER COLUMN sur une contrainte CHECK.
        // On recrée la colonne via une colonne temporaire.
        DB::statement('ALTER TABLE signalements ADD COLUMN status_new TEXT NOT NULL DEFAULT "enregistre" CHECK(status_new IN ("enregistre","en_cours","resolu","rejete"))');
        DB::statement('UPDATE signalements SET status_new = status');
        DB::statement('ALTER TABLE signalements DROP COLUMN status');
        DB::statement('ALTER TABLE signalements RENAME COLUMN status_new TO status');

        // Même chose pour la table signalement_timelines
        DB::statement('ALTER TABLE signalement_timelines ADD COLUMN status_new TEXT NOT NULL DEFAULT "enregistre" CHECK(status_new IN ("enregistre","en_cours","resolu","rejete"))');
        DB::statement('UPDATE signalement_timelines SET status_new = status');
        DB::statement('ALTER TABLE signalement_timelines DROP COLUMN status');
        DB::statement('ALTER TABLE signalement_timelines RENAME COLUMN status_new TO status');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE signalements ADD COLUMN status_new TEXT NOT NULL DEFAULT "enregistre" CHECK(status_new IN ("enregistre","en_cours","resolu"))');
        DB::statement('UPDATE signalements SET status_new = CASE WHEN status = "rejete" THEN "enregistre" ELSE status END');
        DB::statement('ALTER TABLE signalements DROP COLUMN status');
        DB::statement('ALTER TABLE signalements RENAME COLUMN status_new TO status');

        DB::statement('ALTER TABLE signalement_timelines ADD COLUMN status_new TEXT NOT NULL DEFAULT "enregistre" CHECK(status_new IN ("enregistre","en_cours","resolu"))');
        DB::statement('UPDATE signalement_timelines SET status_new = CASE WHEN status = "rejete" THEN "enregistre" ELSE status END');
        DB::statement('ALTER TABLE signalement_timelines DROP COLUMN status');
        DB::statement('ALTER TABLE signalement_timelines RENAME COLUMN status_new TO status');
    }
};
