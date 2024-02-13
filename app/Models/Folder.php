<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Kalnoy\Nestedset\NodeTrait;

class Folder extends Model
{
    use HasFactory, HasUuids, NodeTrait, SoftDeletes;

    protected $fillable = [
        'name',
        'path',
        'parent_id',
        'created_by',
    ];

    // public function parent(): BelongsTo
    // {
    //     return $this->belongsTo(Folder::class, 'parent_id');
    // }

    // public function children(): HasMany
    // {
    //     return $this->hasMany(Folder::class, 'parent_id');
    // }

    public function files(): HasMany
    {
        return $this->hasMany(CustomFile::class, 'folder_id');
    }
}
