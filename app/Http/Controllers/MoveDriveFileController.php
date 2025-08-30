<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\MoveDriveFilesToFolder;
use App\Http\Requests\MoveDriveFileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MoveDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(MoveDriveFileRequest $request, MoveDriveFilesToFolder $moveDriveFileAction): RedirectResponse
    {
        /** @var array{target_folder_id: string, file_ids: array<string>} */
        $input = $request->validated();

        $moveDriveFileAction->handle(driveFileIds: $input['file_ids'], targetFolderUuid: $input['target_folder_id']);

        return to_route('folders.index');
    }
}
