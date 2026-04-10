<?php

declare(strict_types=1);

namespace App\Actions\Folder;

use App\Models\Folder;
use Exception;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class BulkDestroyFolders
{
    /**
     * @param list<string> $folderUuids
     */
    public function handle(array $folderUuids): void
    {
        abort_if($folderUuids === [], Response::HTTP_UNPROCESSABLE_ENTITY, 'No folder to delete.');

        $folders = Folder::query()->whereIn('uuid', $folderUuids)->get();

        abort_unless(
            $folders->count() === count($folderUuids),
            Response::HTTP_UNPROCESSABLE_ENTITY,
            'One or more folders not found.'
        );

        foreach ($folders as $folder) {
            try {
                Storage::disk('s3')->deleteDirectory($folder->path);
                $folder->delete();
            } catch (Exception $exception) {
                report($exception);
            }
        }
    }
}
