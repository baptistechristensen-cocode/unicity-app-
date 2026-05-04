<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReponseSondage extends Model
{
    protected $table = 'reponses_sondages';

    protected $fillable = [
        'sondage_id',
        'user_id',
    ];

    public function sondage(): BelongsTo
    {
        return $this->belongsTo(Sondage::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reponsesQuestions(): HasMany
    {
        return $this->hasMany(ReponseQuestion::class, 'reponse_sondage_id');
    }
}
