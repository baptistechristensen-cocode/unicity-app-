<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sondage extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'date_debut',
        'date_fin',
        'status',
        'audience',
        'user_id',
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin'   => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(QuestionSondage::class)->orderBy('ordre');
    }

    public function reponses(): HasMany
    {
        return $this->hasMany(ReponseSondage::class);
    }

    public function isActif(): bool
    {
        return $this->status === 'actif';
    }

    public function isTermine(): bool
    {
        return $this->status === 'termine';
    }
}
