<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\BulkArchiveDriveFiles;
use App\Http\Requests\BulkArchiveDriveFileRequest;
use Illuminate\Http\RedirectResponse;

class BulkArchiveDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(BulkArchiveDriveFileRequest $request, BulkArchiveDriveFiles $bulkArchiveDriveFilesAction): RedirectResponse
    {
        /** @var array{file_ids: list<string>, current_folder_id: string} */
        $input = $request->validated();

        $bulkArchiveDriveFilesAction->handle($input['file_ids']);

        return to_route(
            route: 'folders.index',
            parameters: ['folder' => $input['current_folder_id']]
        );
    }
}
