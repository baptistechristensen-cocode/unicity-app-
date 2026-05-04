<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReponseQuestion extends Model
{
    protected $table = 'reponses_questions';

    protected $fillable = [
        'reponse_sondage_id',
        'question_id',
        'option_id',
        'texte',
    ];

    public function reponseSondage(): BelongsTo
    {
        return $this->belongsTo(ReponseSondage::class, 'reponse_sondage_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(QuestionSondage::class, 'question_id');
    }

    public function option(): BelongsTo
    {
        return $this->belongsTo(OptionQuestion::class, 'option_id');
    }
}
