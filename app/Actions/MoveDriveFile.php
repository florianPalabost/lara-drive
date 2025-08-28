<?php

declare(strict_types=1);

namespace App\Actions;

use App\Exceptions\FileAlreadyExistInTargetFolderException;
use App\Models\DriveFile;
use App\Models\DriveFileVersion;
use App\Models\Folder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MoveDriveFile
{
    public function handle(DriveFile $driveFile, Folder $targetFolder): void
    {
        // validate there is no file with same name (already done by form request but redo it here)
        // move file in storage
        // get new path
        // update file path in database
        // update folder id of file

        $this->ensureFileNotExistsInTargetFolder($driveFile, $targetFolder);

        $newFileFolderPath = sprintf('users/%s/folders/%s%s', auth()->user()->uuid, $targetFolder->parent ? $targetFolder->path . '/' . $targetFolder->uuid : '', $targetFolder->uuid);

        $driveFile->load('versions');

        DB::transaction(function () use ($driveFile, $newFileFolderPath, $targetFolder) {
            collect($driveFile->versions)->each(function (DriveFileVersion $version) use ($newFileFolderPath) {
                $newVersionPath = sprintf('%s/%s', $newFileFolderPath, $version->uuid);

                throw_unless(
                    Storage::move(from: $version->path, to: $newVersionPath),
                    'Failed to move file ' . $version->path . ' to ' . $newVersionPath
                );

                /** @var DriveFileVersion $version */
                $version->updateQuietly([
                    'path' => $newVersionPath,
                ]);
            });

            $driveFile->update([
                'folder_id' => $targetFolder->id,
            ]);
        });
    }

    /**
     * @throws FileAlreadyExistInTargetFolderException
     */
    private function ensureFileNotExistsInTargetFolder(DriveFile $driveFile, Folder $targetFolder): void
    {
        $existingFile = Folder::query()
            ->with('files', 'files.currentVersion')
            ->where('id', $targetFolder->id)
            ->whereHas('files', function ($query) use ($driveFile) {
                $query->whereHas('currentVersion', function ($query) use ($driveFile) {
                    $query->where('original_name', $driveFile->original_name);
                });
            })->exists();

        throw_if($existingFile, FileAlreadyExistInTargetFolderException::class, $driveFile->original_name);
    }
}
