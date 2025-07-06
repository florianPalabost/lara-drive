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
     */
    public function handle(array $files, ?string $folderUuid = null): void
    {
        $user = auth()->user();

        $parentFolder = $folderUuid ? Folder::query()
                ->where('uuid', $folderUuid)
                ->firstOrFail() : null;

        $newFiles = [];

        foreach ($files as $file) {
            $newFiles[] = new CreateNewDriveFile()->handle([
                'folder_id' => $parentFolder->uuid ?? null,
                'file'      => $file,
            ]);
        }
    }
}
