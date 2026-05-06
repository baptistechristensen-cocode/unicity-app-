<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            // PostgreSQL: drop the old CHECK constraint and add a new one including 'rejete'
            DB::statement("ALTER TABLE signalements DROP CONSTRAINT IF EXISTS signalements_status_check");
            DB::statement("ALTER TABLE signalements ADD CONSTRAINT signalements_status_check CHECK (status IN ('enregistre','en_cours','resolu','rejete'))");

            DB::statement("ALTER TABLE signalement_timelines DROP CONSTRAINT IF EXISTS signalement_timelines_status_check");
            DB::statement("ALTER TABLE signalement_timelines ADD CONSTRAINT signalement_timelines_status_check CHECK (status IN ('enregistre','en_cours','resolu','rejete'))");
        } else {
            // SQLite: recreate column via swap (SQLite does not support ALTER COLUMN)
            DB::statement("ALTER TABLE signalements ADD COLUMN status_new TEXT NOT NULL DEFAULT 'enregistre' CHECK(status_new IN ('enregistre','en_cours','resolu','rejete'))");
            DB::statement('UPDATE signalements SET status_new = status');
            DB::statement('ALTER TABLE signalements DROP COLUMN status');
            DB::statement('ALTER TABLE signalements RENAME COLUMN status_new TO status');

            DB::statement("ALTER TABLE signalement_timelines ADD COLUMN status_new TEXT NOT NULL DEFAULT 'enregistre' CHECK(status_new IN ('enregistre','en_cours','resolu','rejete'))");
            DB::statement('UPDATE signalement_timelines SET status_new = status');
            DB::statement('ALTER TABLE signalement_timelines DROP COLUMN status');
            DB::statement('ALTER TABLE signalement_timelines RENAME COLUMN status_new TO status');
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE signalements DROP CONSTRAINT IF EXISTS signalements_status_check");
            DB::statement("ALTER TABLE signalements ADD CONSTRAINT signalements_status_check CHECK (status IN ('enregistre','en_cours','resolu'))");

            DB::statement("ALTER TABLE signalement_timelines DROP CONSTRAINT IF EXISTS signalement_timelines_status_check");
            DB::statement("ALTER TABLE signalement_timelines ADD CONSTRAINT signalement_timelines_status_check CHECK (status IN ('enregistre','en_cours','resolu'))");
        } else {
            DB::statement("ALTER TABLE signalements ADD COLUMN status_new TEXT NOT NULL DEFAULT 'enregistre' CHECK(status_new IN ('enregistre','en_cours','resolu'))");
            DB::statement("UPDATE signalements SET status_new = CASE WHEN status = 'rejete' THEN 'enregistre' ELSE status END");
            DB::statement('ALTER TABLE signalements DROP COLUMN status');
            DB::statement('ALTER TABLE signalements RENAME COLUMN status_new TO status');

            DB::statement("ALTER TABLE signalement_timelines ADD COLUMN status_new TEXT NOT NULL DEFAULT 'enregistre' CHECK(status_new IN ('enregistre','en_cours','resolu'))");
            DB::statement("UPDATE signalement_timelines SET status_new = CASE WHEN status = 'rejete' THEN 'enregistre' ELSE status END");
            DB::statement('ALTER TABLE signalement_timelines DROP COLUMN status');
            DB::statement('ALTER TABLE signalement_timelines RENAME COLUMN status_new TO status');
        }
    }
};
