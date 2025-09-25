<?php

declare(strict_types=1);

namespace App\Actions\DriveFile;

use App\Actions\DriveFileVersion\CreateNewDriveFileVersion;
use App\Models\DriveFile;
use App\Models\Folder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CreateNewDriveFile
{
    public function __construct(protected CreateNewDriveFileVersion $createNewDriveFileVersionAction) {}

    /**
     * @param array{folder_id: string, file: UploadedFile|null} $data
     */
    public function handle(array $data): DriveFile
    {
        $folder = Folder::query()
            ->with('parent')
            ->where('uuid', $data['folder_id'])
            ->firstOrFail();

        $uploadedFile = $data['file'];

        abort_unless($uploadedFile instanceof UploadedFile, Response::HTTP_UNPROCESSABLE_ENTITY, 'File is required.');

        $user = auth()->user();

        // ensure file not exists in this folder else just create a new version
        $existingFile = DriveFile::query()
            ->where('folder_id', $folder->id)
            ->where('original_name', $uploadedFile->getClientOriginalName())
            ->first();

        if ($existingFile) {
            $this->createNewDriveFileVersionAction->handle($existingFile, $data);

            return $existingFile;
        }

        return DB::transaction(function () use ($folder, $user, $data): DriveFile {
            $driveFile = DriveFile::create([
                'folder_id'     => $folder->id,
                'original_name' => $data['file']->getClientOriginalName(),
                'user_id'       => $user->id,
            ]);

            $driveFile->refresh();

            $this->createNewDriveFileVersionAction->handle(
                $driveFile,
                [
                    'file' => $data['file'],
                ]
            );

            return $driveFile;
        });
    }
}
