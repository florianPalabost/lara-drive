<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasTimestampsScopes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class CustomFile extends Model implements HasMedia
{
    use HasFactory,HasTimestampsScopes, HasUuids, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'name',
        'path',
        'extension',
        'created_by',
        'folder_id',
        'is_public',
        'size',
    ];

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class, 'folder_id');
    }
}
