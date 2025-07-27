<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\DriveFile;
use App\Models\DriveFileVersion;
use Illuminate\Http\UploadedFile;

class CreateNewDriveFileVersion
{
    /**
     * @param array{file: UploadedFile} $data
     */
    public function handle(DriveFile $driveFile, array $data): DriveFileVersion
    {
        $uploadedFile = $data['file'];
        $user = auth()->user();
        $folder = $driveFile->folder;

        // create file path folder
        $path = sprintf('users/%s/folders/%s%s', $user->uuid, $folder->parent ? $folder->path . '/' . $folder->uuid : '', $folder->uuid);

        // store file in storage
        $storedPath = $uploadedFile->storeAs($path, $uploadedFile->getClientOriginalName(), ['disk' => 'minio']);

        $maxVersion = $driveFile->versions()->max('version');

        if ($maxVersion) {
            $driveFile->versions()->where('version', $maxVersion)->update(['is_current' => false]);
        }

        $payload = [
            'is_current' => true,
            'mime_type'  => $uploadedFile->getClientMimeType(),
            'path'       => $storedPath,
            'size'       => $uploadedFile->getSize(),
            'version'    => $maxVersion + 1,
        ];

        return $driveFile->versions()->create($payload);
    }
}
