<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\DriveFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class BulkCreateNewDriveFiles
{
    public function __construct(protected CreateNewDriveFile $createNewDriveFileAction) {}

    /**
     * @param array{folder_id: string, files: UploadedFile[]} $data
     * @return DriveFile[]
     */
    public function handle(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $results = [];

            foreach ($data['files'] as $uploadedFile) {
                $results[] = $this->createNewDriveFileAction->handle([
                    'folder_id' => $data['folder_id'],
                    'file'      => $uploadedFile,
                ]);
            }

            return $results;
        });
    }
}
