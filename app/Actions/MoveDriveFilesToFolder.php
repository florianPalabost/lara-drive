<?php

declare(strict_types=1);

namespace App\Actions;

use App\Exceptions\FileAlreadyExistInTargetFolderException;
use App\Models\DriveFile;
use App\Models\DriveFileVersion;
use App\Models\Folder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MoveDriveFilesToFolder
{
    /**
     * @param DriveFile[] $driveFiles
     *
     * @throws FileAlreadyExistInTargetFolderException
     */
    public function handle(array $driveFiles, Folder $targetFolder): void
    {
        // validate there is no file with same name (already done by form request but redo it here)
        // move file in storage
        // get new path
        // update file path in database
        // update folder id of file

        $this->ensureFilesNotExistsInTargetFolder($driveFiles, $targetFolder);

        $newFileFolderPath = sprintf('users/%s/folders/%s%s', auth()->user()->uuid, $targetFolder->parent ? $targetFolder->path . '/' . $targetFolder->uuid : '', $targetFolder->uuid);

        DB::transaction(function () use ($driveFiles, $newFileFolderPath, $targetFolder) {
            collect($driveFiles)->each(function (DriveFile $driveFile) use ($newFileFolderPath, $targetFolder) {

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
        });
    }

    /**
     * @param DriveFile[] $driveFiles
     *
     * @throws FileAlreadyExistInTargetFolderException
     */
    private function ensureFilesNotExistsInTargetFolder(array $driveFiles, Folder $targetFolder): void
    {
        $existingInFolder = Folder::query()
            ->with('files', 'files.currentVersion')
            ->where('id', $targetFolder->id)
            ->whereHas('files', function ($query) use ($driveFiles) {
                // $query->whereIn('id', collect($driveFiles)->pluck('id')->toArray());
                $query->whereHas('currentVersion', function ($query) use ($driveFile) {
                    $query->where('original_namsqe', $driveFile->original_name);
                });
            })->get();

        if ($existingInFolder->isEmpty()) {
            return;
        }

        $diff = collect($driveFiles)->diff($existingInFolder);

        throw_if($diff->isNotEmpty(), FileAlreadyExistInTargetFolderException::class, $diff->implode('original_name', ', '));
    }
}
