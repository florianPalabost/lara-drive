<?php

declare(strict_types=1);

namespace App\Actions;

use App\Exceptions\FileAlreadyExistInTargetFolderException;
use App\Models\DriveFile;
use App\Models\DriveFileVersion;
use App\Models\Folder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class MoveDriveFilesToFolder
{
    /**
     * @param string[] $driveFileIds
     *
     * @throws FileAlreadyExistInTargetFolderException
     */
    public function handle(array $driveFileIds, string $targetFolderUuid): void
    {
        // validate there is no file with same name (already done by form request but redo it here)
        // move file in storage
        // get new path
        // update file path in database
        // update folder id of file

        $targetFolder = Folder::query()->where('uuid', $targetFolderUuid)->firstOrFail();
        $driveFiles = DriveFile::query()->with('versions')->whereIn('uuid', $driveFileIds)->get();

        abort_unless(boolean: $driveFiles->count() === count($driveFileIds), code: Response::HTTP_UNPROCESSABLE_ENTITY, message: 'File(s) not found.');

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
     * @param Collection<int,DriveFile> $driveFiles
     *
     * @throws FileAlreadyExistInTargetFolderException
     */
    private function ensureFilesNotExistsInTargetFolder(Collection $driveFiles, Folder $targetFolder): void
    {
        /** @var Collection<int,DriveFile> $driveFileNames */
        $driveFileNames = DriveFile::query()
            ->with('currentVersion')
            ->whereIn('id', collect($driveFiles)->pluck('id')->toArray())
            ->select('original_name', 'id')
            ->get();

        $existingInFolder = Folder::query()
            ->with('files', 'files.currentVersion')
            ->where('id', $targetFolder->id)
            ->whereHas('files', function ($query) use ($driveFileNames) {
                $query->whereHas('currentVersion', function ($query) use ($driveFileNames) {
                    $query->whereIn('original_name', $driveFileNames->pluck('original_name')->toArray());
                });
            });

        $isExistingInFolder = $existingInFolder->exists();

        /** @var Collection<int,DriveFile> $diff */
        $diff = $driveFileNames->diff($existingInFolder->get()->pluck('original_name'));

        throw_if($isExistingInFolder, FileAlreadyExistInTargetFolderException::class, implode(', ', $diff->pluck('original_name')->toArray()));
    }
}
