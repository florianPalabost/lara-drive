<?php

declare(strict_types=1);

namespace App\Actions;

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

        // create file path folder
        $path = sprintf('users/%s/folders/%s%s', $user->uuid, $folder->parent ? $folder->path . '/' . $folder->uuid : '', $folder->uuid);

        // store file in storage
        $storedPath = $uploadedFile->storeAs($path, $uploadedFile->getClientOriginalName(), ['disk' => 'minio']);

        return DB::transaction(function () use ($folder, $user, $storedPath, $data): DriveFile {
            $driveFile = DriveFile::create([
                'folder_id'     => $folder->id,
                'original_name' => $data['file']->getClientOriginalName(),
                'user_id'       => $user->id,
            ]);

            $driveFile->refresh();

            $this->createNewDriveFileVersionAction->handle($driveFile, [
                'mime_type' => $data['file']->getClientMimeType(),
                'size'      => $data['file']->getSize(),
                'path'      => $storedPath,
            ]);

            return $driveFile;
        });
    }
}
