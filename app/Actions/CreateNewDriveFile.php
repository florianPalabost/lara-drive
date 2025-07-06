<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\DriveFile;
use App\Models\Folder;
use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpFoundation\Response;

class CreateNewDriveFile
{
    /**
     * @param array{folder_id: string, file: UploadedFile} $data
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

        // store file in database
        return DriveFile::create([
            'folder_id'     => $folder->id,
            'original_name' => $data['file']->getClientOriginalName(),
            'mime_type'     => $data['file']->getClientMimeType(),
            'size'          => $data['file']->getSize(),
            'path'          => $storedPath,
            'user_id'       => $user->id,
        ]);
    }
}
