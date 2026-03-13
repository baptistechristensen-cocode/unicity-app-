<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Signalement extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'commentaire',
        'category',
        'status',
        'location',
        'latitude',
        'longitude',
        'photo',
        'user_id',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function timelines(): HasMany
    {
        return $this->hasMany(SignalementTimeline::class)->orderBy('created_at', 'desc');
    }

    protected static function booted(): void
    {
        static::created(function (Signalement $signalement) {
            $signalement->timelines()->create([
                'status' => 'enregistre',
                'description' => 'Signalement enregistre',
            ]);
        });
    }
}
