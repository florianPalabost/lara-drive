<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\BulkDeleteDriveFiles;
use App\Http\Requests\BulkDeleteDriveFileRequest;
use App\Models\DriveFile;
use Illuminate\Http\RedirectResponse;

class BulkDeleteDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(BulkDeleteDriveFileRequest $request, BulkDeleteDriveFiles $bulkDeleteDriveFilesAction): RedirectResponse
    {
        /** @var array{file_ids: list<string>} */
        $input = $request->validated();

        $bulkDeleteDriveFilesAction->handle($input['file_ids']);

        $driveFile = DriveFile::with('folder')->where('uuid', $input['file_ids'][0])->first();

        return to_route('folders.index', ['folder' => $driveFile->folder->uuid]);
    }
}
