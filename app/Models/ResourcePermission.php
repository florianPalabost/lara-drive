<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ResourcePermission extends Model
{
    /** @use HasFactory<\Database\Factories\ResourcePermissionFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'permissionable_type',
        'permissionable_id',
        'permission',
    ];

    /**
     * @return MorphTo<Model,$this>
     */
    public function permissionable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @return BelongsTo<User,$this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
