<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\DriveFile;
use App\Models\DriveFileVersion;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class BulkDestroyDriveFiles
{
    /**
     * @param list<string> $driveFileIds
     */
    public function handle(array $driveFileIds): void
    {
        // TODO: after implem, just early return instead of abort
        abort_if(boolean: $driveFileIds === [], code: Response::HTTP_UNPROCESSABLE_ENTITY, message: 'no file to delete');

        DB::transaction(function () use ($driveFileIds) {
            DriveFileVersion::query()->whereIn('drive_file_id', $driveFileIds)->forceDelete();

            // We should only destroy trashed files !
            $filesDeletedCount = DriveFile::onlyTrashed()
                ->whereIn('uuid', $driveFileIds)
                ->forceDelete();

            abort_unless(
                boolean: $filesDeletedCount === count($driveFileIds),
                code: Response::HTTP_INTERNAL_SERVER_ERROR,
                message: 'Mismatch between files deleted and files to delete.'
            );
        });
    }
}
