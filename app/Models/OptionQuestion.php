<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OptionQuestion extends Model
{
    protected $table = 'options_questions';

    protected $fillable = [
        'question_id',
        'texte',
        'ordre',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(QuestionSondage::class, 'question_id');
    }
}
