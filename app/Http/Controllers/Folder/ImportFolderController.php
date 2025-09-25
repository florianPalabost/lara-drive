<?php

declare(strict_types=1);

namespace App\Http\Controllers\Folder;

use App\Http\Controllers\Controller;
use App\Http\Requests\Folder\ImportFolderRequest;
use App\Models\Folder;
use App\Services\ImportFolderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
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
    public function store(ImportFolderRequest $request, ImportFolderService $importFolderService): RedirectResponse
    {
        /** @var array{files: array<UploadedFile>, paths: array<string>, base_folder_id: string} $input */
        $input = $request->validated();
        Log::debug('import folder input:', ['input' => $input]);

        $importFolderService->handle($input['files'], $input['paths'], $input['base_folder_id']);

        return to_route('folders.index');
    }
}
