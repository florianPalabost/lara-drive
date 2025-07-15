<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\DriveFile;
use App\Models\DriveFileVersion;

class CreateNewDriveFileVersion
{
    /**
     * @param array{mime_type: string, size: int, path: string} $data
     */
    public function handle(DriveFile $driveFile, array $data): DriveFileVersion
    {
        $payload = [
            'is_current' => true,
            'mime_type'  => $data['mime_type'],
            'size'       => $data['size'],
            'path'       => $data['path'],
            'version'    => $driveFile->versions()->max('version') + 1,
        ];

        return $driveFile->versions()->create($payload);
    }
}
