<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SignalementTimeline extends Model
{
    protected $fillable = [
        'signalement_id',
        'status',
        'description',
    ];

    public function signalement(): BelongsTo
    {
        return $this->belongsTo(Signalement::class);
    }
}
