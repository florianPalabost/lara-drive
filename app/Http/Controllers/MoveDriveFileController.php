<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\MoveDriveFilesToFolder;
use App\Http\Requests\MoveDriveFileRequest;
use Illuminate\Http\Request;

class MoveDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(MoveDriveFileRequest $request, MoveDriveFilesToFolder $moveDriveFileAction)
    {
        /** @var array{target_folder_id: string, file_ids: array<string>} */
        $input = $request->validated();

        return $moveDriveFileAction->handle(driveFile: $driveFile, targetFolder: $targetFolder);
    }
}
