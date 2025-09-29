<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuidColumn;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Folder extends Model
{
    /** @use HasFactory<\Database\Factories\FolderFactory> */
    use HasFactory, HasUuidColumn;

    protected $fillable = ['uuid', 'name', 'path', 'parent_id', 'user_id'];

    /**
     * @return BelongsTo<Folder,$this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    /**
     * @return HasMany<Folder,$this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(Folder::class, 'parent_id');
    }

    /**
     * @return HasMany<DriveFile,$this>
     */
    public function files(): HasMany
    {
        return $this->hasMany(DriveFile::class, 'folder_id');
    }

    /**
     * @return MorphMany<ResourcePermission,$this>
     */
    public function permissions(): MorphMany
    {
        return $this->morphMany(ResourcePermission::class, 'permissionable');
    }

    /**
     * @return MorphMany<ResourceShare,$this>
     */
    public function shares(): MorphMany
    {
        return $this->morphMany(ResourceShare::class, 'shareable');
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
