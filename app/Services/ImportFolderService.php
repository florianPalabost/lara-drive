<?php

declare(strict_types=1);

namespace App\Services;

use App\Actions\CreateNewDriveFile;
use App\Models\Folder;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class ImportFolderService
{
    /**
     * Invoke the class instance.
     *
     * @param array<UploadedFile> $files
     * @param list<string> $paths
     */
    public function handle(array $files, array $paths, ?string $folderUuid = null): void
    {
        $parentFolder = $folderUuid ? Folder::query()
            ->where('uuid', $folderUuid)
            ->firstOrFail() : null;

        $newFiles = [];

        try {
            DB::beginTransaction();

            /** @var array<int, Folder> */
            $foldersCache = [];

            foreach ($files as $index => $file) {
                $currentPath = $paths[$index];

                $folderId = $this->ensureFoldersExistForPath($currentPath, $parentFolder);

                $folder = $foldersCache[$folderId] ??= Folder::query()
                    ->where('id', $folderId)
                    ->firstOrFail();

                $newFiles[] = (new CreateNewDriveFile)->handle([
                    'folder_id' => $folder->uuid,
                    'file'      => $file,
                ]);
            }

            DB::commit();
        }
        catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function ensureFoldersExistForPath(string $relativePath, ?Folder $parentFolder): ?int
    {
        $pathParts = explode('/', $relativePath);
        array_pop($pathParts); // remove the filename

        $folderCache = [];
        $currentPath = '';
        $parentId = $parentFolder->id ?? null;

        foreach ($pathParts as $folderName) {
            $currentPath .= ($currentPath !== '' && $currentPath !== '0' ? '/' : '') . $folderName;

            if (isset($folderCache[$currentPath])) {
                $parentId = $folderCache[$currentPath];

                continue;
            }

            $folder = Folder::firstOrCreate([
                'name'      => $folderName,
                'parent_id' => $parentId,
                'user_id'   => auth()->user()->id,
                'path'      => $currentPath,
            ]);

            $folderCache[$currentPath] = $folder->id;
            $parentId = $folder->id;
        }

        // last folder is the parent
        return $parentId;
    }
}
