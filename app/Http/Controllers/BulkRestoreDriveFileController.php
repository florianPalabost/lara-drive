<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\BulkRestoreDriveFiles;
use App\Http\Requests\BulkRestoreDriveFileRequest;
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
