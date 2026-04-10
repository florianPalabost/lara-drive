<?php

declare(strict_types=1);

namespace App\Http\Controllers\Folder;

use App\Actions\Folder\MoveFoldersToFolder;
use App\Http\Controllers\Controller;
use App\Http\Requests\Folder\MoveFolderRequest;
use Illuminate\Http\RedirectResponse;

class MoveFolderController extends Controller
{
    public function __invoke(MoveFolderRequest $request, MoveFoldersToFolder $moveFoldersAction): RedirectResponse
    {
        /** @var array{folder_ids: list<string>, target_folder_id: string} */
        $input = $request->validated();

        $moveFoldersAction->handle($input['folder_ids'], $input['target_folder_id']);

        return to_route('folders.index');
    }
}
