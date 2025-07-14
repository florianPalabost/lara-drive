<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DriveFileVersion extends Model
{
    /** @use HasFactory<\Database\Factories\DriveFileVersionFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'drive_file_id',
        'path',
        'version',
        'is_current',
        'size',
        'mime_type',
    ];

    /**
     * @return BelongsTo<DriveFile,$this>
     */
    public function file(): BelongsTo
    {
        return $this->belongsTo(DriveFile::class, 'drive_file_id');
    }
}
