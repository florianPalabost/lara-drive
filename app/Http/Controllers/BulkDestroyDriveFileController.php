<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\BulkDestroyDriveFiles;
use App\Http\Requests\BulkDestroyDriveFileRequest;
use Illuminate\Http\RedirectResponse;

class BulkDestroyDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(BulkDestroyDriveFileRequest $request, BulkDestroyDriveFiles $bulkdestroyDriveFilesAction): RedirectResponse
    {
        /** @var array{file_ids: list<string>} */
        $input = $request->validated();

        $bulkdestroyDriveFilesAction->handle($input['file_ids']);

        return to_route('files.trashed');
    }
}
