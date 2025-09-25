<?php

declare(strict_types=1);

namespace App\Actions\DriveFile;

use App\Models\DriveFile;
use App\Models\DriveFileVersion;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class BulkArchiveDriveFiles
{
    /**
     * Soft delete files & versions (mostl likely current version)
     *
     * @param list<string> $driveFileIds
     */
    public function handle(array $driveFileIds): void
    {
        // TODO: after implem, just early return instead of abort
        abort_if(boolean: $driveFileIds === [], code: Response::HTTP_UNPROCESSABLE_ENTITY, message: 'no file to archive');

        DB::transaction(function () use ($driveFileIds) {
            DriveFileVersion::query()->whereIn('drive_file_id', $driveFileIds)->delete();

            $filesDeletedCount = DriveFile::withoutTrashed()
                ->whereIn('uuid', $driveFileIds)
                ->delete();

            abort_unless(
                boolean: $filesDeletedCount === count($driveFileIds),
                code: Response::HTTP_INTERNAL_SERVER_ERROR,
                message: 'Mismatch between files deleted and files to archive.'
            );
        });
    }
}
