<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ImportFolderRequest;
use App\Models\Folder;
use App\Services\ImportFolderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class ImportFolderController extends Controller
{
    public function import(Request $request): Response
    {
        $folder = Folder::query()
            ->where('uuid', $request->get('folder'))
            ->firstOrFail();

        return inertia('folders/import', [
            'selectedFolder' => $folder,
        ]);
    }

    /**
     * Handle the incoming request.
     */
    public function store(ImportFolderRequest $request, ImportFolderService $importFolderService)
    {
        $input = $request->validated();
        Log::debug('input', $input);
        $importFolderService->handle($input['files'], $input['base_folder_id']);

        return to_route('folders.index');
        // $user = auth()->user();
        // $baseParentFolder = Folder::query()
        //     ->where('user_id', $user->id)
        //     ->where('uuid', $input['base_folder_id'])
        //     ->firstOrFail();

        // $folderMap = []; // path => Folder model
        // $folderMap[''] = $baseParentFolder;

        // foreach ($input['files'] as $file) {
        //     // extract folder path & filename
        //     $relativePath = $file->getClientOriginalName(); // sub1/sub2/file.txt

        //     // create each folder if not exists in the path

        //     // create & store file
        // }
    }
}
