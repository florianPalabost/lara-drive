<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuidColumn;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DriveFile extends Model
{
    /** @use HasFactory<\Database\Factories\DriveFileFactory> */
    use HasFactory, HasUuidColumn;

    protected $fillable = [
        'uuid',
        'folder_id',
        'original_name',
        'mime_type',
        'path',
        'size',
        'user_id',
    ];

    /**
     * @return BelongsTo<Folder,$this>
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    /**
     * @return BelongsTo<User,$this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
