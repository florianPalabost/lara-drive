<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuidColumn;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class DriveFile extends Model
{
    /** @use HasFactory<\Database\Factories\DriveFileFactory> */
    use HasFactory, HasUuidColumn, SoftDeletes;

    protected $fillable = [
        'uuid',
        'folder_id',
        'original_name',
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
     * @return HasMany<DriveFileShare,$this>
     */
    public function shares(): HasMany
    {
        return $this->hasMany(DriveFileShare::class, 'drive_file_id');
    }

    /**
     * @return BelongsTo<User,$this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<DriveFileVersion,$this>
     */
    public function versions(): HasMany
    {
        return $this->hasMany(DriveFileVersion::class)->orderBy('version', 'desc')->withTrashed();
    }

    /**
     * @return HasOne<DriveFileVersion,$this>
     */
    public function currentVersion(): HasOne
    {
        return $this->hasOne(DriveFileVersion::class)->where('is_current', true)->latest();
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
