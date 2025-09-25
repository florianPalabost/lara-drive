<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\DriveFile;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class BulkRestoreDriveFiles
{
    /**
     * @param list<string> $driveFileIds
     * @return DriveFile[]
     */
    public function handle(array $driveFileIds): array
    {
        // TODO: after implem, just early return instead of abort
        abort_if($driveFileIds === [], Response::HTTP_UNPROCESSABLE_ENTITY, 'no file to restore');

        return DB::transaction(function () use ($driveFileIds) {
            $filesRestoredCount = DriveFile::onlyTrashed()
                ->whereIn('uuid', $driveFileIds)
                ->restore();

            $driveFiles = DriveFile::query()->with('currentVersion')->whereIn('uuid', $driveFileIds)->get();

            foreach ($driveFiles as $driveFile) {
                $driveFile->currentVersion()->onlyTrashed()->restore();
            }

            return $driveFiles->toArray();
        });
    }
}
