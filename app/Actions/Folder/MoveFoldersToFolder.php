<?php

declare(strict_types=1);

namespace App\Actions\Folder;

use App\Models\Folder;
use Symfony\Component\HttpFoundation\Response;

class MoveFoldersToFolder
{
    /**
     * @param list<string> $folderUuids
     */
    public function handle(array $folderUuids, string $targetFolderUuid): void
    {
        abort_if($folderUuids === [], Response::HTTP_UNPROCESSABLE_ENTITY, 'No folder to move.');

        $targetFolder = Folder::query()->where('uuid', $targetFolderUuid)->firstOrFail();

        $folders = Folder::query()->whereIn('uuid', $folderUuids)->get();

        abort_unless(
            $folders->count() === count($folderUuids),
            Response::HTTP_UNPROCESSABLE_ENTITY,
            'One or more folders not found.'
        );

        foreach ($folders as $folder) {
            abort_if(
                (string) $folder->uuid === $targetFolderUuid,
                Response::HTTP_UNPROCESSABLE_ENTITY,
                'Cannot move a folder into itself.'
            );

            $folder->update(['parent_id' => $targetFolder->id]);
        }
    }
}
