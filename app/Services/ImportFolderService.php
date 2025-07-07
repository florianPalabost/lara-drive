<?php

declare(strict_types=1);

namespace App\Services;

use App\Actions\CreateNewDriveFile;
use App\Models\Folder;
use Illuminate\Http\UploadedFile;

class ImportFolderService
{
    /**
     * Create a new class instance.
     */
    public function __construct() {}

    /**
     * Invoke the class instance.
     *
     * @param array<UploadedFile> $files
     * @param list<string> $paths
     */
    public function handle(array $files, array $paths, ?string $folderUuid = null): void
    {
        $user = auth()->user();

        $parentFolder = $folderUuid ? Folder::query()
                ->where('uuid', $folderUuid)
                ->firstOrFail() : null;

        $newFiles = [];

        foreach ($files as $index => $file) {
            // TODO: extract folder path & filename
            $testCurrentPath = $file->getClientOriginalName(); // TODO: see if relative path & same than $paths[$index]
            $currentPath = $paths[$index];
            $explodedPath = explode('/', $currentPath);
            // TODO: create each folder if not exists in the path


            // TODO: create & store file
            $newFiles[] = new CreateNewDriveFile()->handle([
                'folder_id' => $parentFolder->uuid ?? null,
                'file'      => $file,
            ]);
        }
    }
}
