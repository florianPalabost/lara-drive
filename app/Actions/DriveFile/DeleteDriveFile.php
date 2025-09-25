<?php

declare(strict_types=1);

namespace App\Actions\DriveFile;

use App\Models\DriveFile;
use Illuminate\Support\Facades\DB;

class DeleteDriveFile
{
    public function handle(DriveFile $file): void
    {
        $file->load('currentVersion', 'versions');

        DB::transaction(function () use ($file) {
            // TODO: create action to delete file in storage
            // Storage::disk('minio')->delete($file->path);

            if ($file->versions()->exists()) {
                $file->versions()->delete();
            }

            $file->currentVersion()->delete();

            $file->delete();
        });
    }
}
