<?php

declare(strict_types=1);

namespace App\Http\Controllers\DriveFile;

use App\Actions\DriveFile\BulkRestoreDriveFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\DriveFile\BulkRestoreDriveFileRequest;
use Illuminate\Http\RedirectResponse;

class BulkRestoreDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(BulkRestoreDriveFileRequest $request, BulkRestoreDriveFiles $bulkRestoreDriveFilesAction): RedirectResponse
    {
        /** @var array{file_ids: list<string>} $input */
        $input = $request->validated();

        $bulkRestoreDriveFilesAction->handle($input['file_ids']);

        return to_route('files.trashed');
    }
}
