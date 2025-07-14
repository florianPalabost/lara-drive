<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DriveFileShare extends Model
{
    /** @use HasFactory<\Database\Factories\DriveFileShareFactory> */
    use HasFactory;

    protected $fillable = [
        'drive_file_id',
        'shared_with_user_id',
        'public_token',
        'permission',
        'expires_at',
    ];

    /**
     * @return BelongsTo<DriveFile,$this>
     */
    public function driveFile(): BelongsTo
    {
        return $this->belongsTo(DriveFile::class);
    }

    /**
     * @return BelongsTo<User,$this>
     */
    public function sharedWithUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shared_with_user_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }
}
