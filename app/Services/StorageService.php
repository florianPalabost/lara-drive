<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\DriveFileVersion;
use App\Models\User;

class StorageService
{
    /**
     * Returns the total bytes used by the current versions of all
     * files belonging to the given user (soft-deleted files excluded).
     */
    public function getUsedBytes(User $user): int
    {
        return (int) DriveFileVersion::query()
            ->join('drive_files', 'drive_file_versions.drive_file_id', '=', 'drive_files.id')
            ->where('drive_files.user_id', $user->id)
            ->where('drive_file_versions.is_current', true)
            ->whereNull('drive_file_versions.deleted_at')
            ->whereNull('drive_files.deleted_at')
            ->sum('drive_file_versions.size');
    }
}
