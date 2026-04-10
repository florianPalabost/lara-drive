<?php

declare(strict_types=1);

namespace App\Http\Controllers\Folder;

use App\Actions\Folder\BulkDestroyFolders;
use App\Http\Controllers\Controller;
use App\Http\Requests\Folder\BulkDestroyFolderRequest;
use Illuminate\Http\RedirectResponse;

class BulkDestroyFolderController extends Controller
{
    public function __invoke(BulkDestroyFolderRequest $request, BulkDestroyFolders $bulkDestroyFoldersAction): RedirectResponse
    {
        /** @var array{folder_ids: list<string>, current_folder_id: string} */
        $input = $request->validated();

        $bulkDestroyFoldersAction->handle($input['folder_ids']);

        return to_route('folders.index', ['folder' => $input['current_folder_id']]);
    }
}
