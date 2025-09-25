<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\DriveFile;
use App\Models\DriveFileVersion;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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
        $newVersionUuid = Str::uuid7()->toString();

        // create file path folder
        $path = sprintf('users/%s/folders/%s%s', $user->uuid, $folder->parent ? $folder->path . '/' . $folder->uuid : '', $folder->uuid);
        $storedPath = $uploadedFile->storeAs($path, $newVersionUuid, ['disk' => 'minio']);

        $maxVersion = $driveFile->versions()->max('version');

        return DB::transaction(function () use ($driveFile, $newVersionUuid, $storedPath, $maxVersion, $uploadedFile) {
            if ($maxVersion) {
                $driveFile->versions()->where('version', $maxVersion)->update(['is_current' => false, 'deleted_at' => now()]);
            }

            $payload = [
                'uuid'       => $newVersionUuid,
                'is_current' => true,
                'mime_type'  => $uploadedFile->getClientMimeType(),
                'path'       => $storedPath,
                'size'       => $uploadedFile->getSize(),
                'version'    => $maxVersion + 1,
            ];

            return $driveFile->versions()->create($payload);
        });
    }
}
