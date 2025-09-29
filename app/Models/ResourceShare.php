<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ResourceShare extends Model
{
    /** @use HasFactory<\Database\Factories\ResourceShareFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'shareable_id',
        'shareable_type',
        'public_token',
        'permission',
        'expires_at',
    ];

    /**
     * @return MorphTo<Model,$this>
     */
    public function shareable(): MorphTo
    {
        return $this->morphTo();
    }

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }
}
