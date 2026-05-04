<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuestionSondage extends Model
{
    protected $table = 'questions_sondages';

    protected $fillable = [
        'sondage_id',
        'texte',
        'type',
        'ordre',
    ];

    public function sondage(): BelongsTo
    {
        return $this->belongsTo(Sondage::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(OptionQuestion::class, 'question_id')->orderBy('ordre');
    }

    public function reponses(): HasMany
    {
        return $this->hasMany(ReponseQuestion::class, 'question_id');
    }
}
