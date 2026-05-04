<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Evenement extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'date_debut',
        'lieu',
        'latitude',
        'longitude',
        'theme',
        'organisateur',
        'banniere',
        'user_id',
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'latitude'   => 'decimal:8',
        'longitude'  => 'decimal:8',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function interets(): HasMany
    {
        return $this->hasMany(EvenementInteret::class);
    }
}
