<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreFolderRequest;
use App\Http\Requests\UpdateFolderRequest;
use App\Models\Folder;
use App\Services\BreadcrumbService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Response;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $selectedFolder = $request->has('folder')
        ? Folder::query()->with('children', 'files', 'files.currentVersion', 'files.currentVersion.file', 'parent', 'children.files', 'children.files.currentVersion')
            ->where('uuid', $request->get('folder'))
            ->firstOrFail()
        : null;

        $folders = Folder::query()->whereNull('parent_id')
            ->with('children', 'files', 'files.currentVersion')
            ->where('user_id', auth()->user()->id)
            ->orderBy('name')
            ->get();

        $breadcrumbs = $selectedFolder ? BreadcrumbService::buildBreadcrumbFromFolder($selectedFolder) : BreadcrumbService::getHomeFoldersBreadcrumbs();

        return inertia('folders/index', [
            'folders'        => $folders,
            'selectedFolder' => $selectedFolder,
            'breadcrumbs'    => $breadcrumbs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $resultData = [];
        $folder = $request->get('folder');

        if ($folder) {
            $folder = Folder::query()
                ->where('uuid', $folder)
                ->firstOrFail();

            $resultData['parent'] = $folder;
        }

        return inertia('folders/create', $resultData);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFolderRequest $request): RedirectResponse
    {
        $input = $request->validated();
        $parentFolder = null;

        if (Arr::has($input, 'parent_id') && $input['parent_id']) {
            $parentFolder = Folder::query()
                ->where('uuid', $input['parent_id'])
                ->firstOrFail();
        }

        $parentFolderPath = $parentFolder ? $parentFolder->path : '';

        $folderUuid = Str::uuid7()->toString();

        $folderPath = $parentFolderPath . '/' . $folderUuid;
        $folderPath = str_replace('//', '/', $folderPath);

        $folder = Folder::create([
            ...$input,
            'parent_id' => $parentFolder->id ?? null,
            'path'      => $folderPath,
            'user_id'   => auth()->user()->id,
            'uuid'      => $folderUuid,
        ]);

        return to_route('folders.index', ['folder' => $folder]);
    }

    /**
     * TODO: move to dedicate controller
     * Display the specified resource.
     */
    public function load(Folder $folder): JsonResponse
    {
        $folder->load(['children', 'files', 'files.currentVersion', 'files.currentVersion.file', 'parent', 'children.files', 'children.files.currentVersion']);

        return response()->json([
            'folder'      => $folder,
            'breadcrumbs' => BreadcrumbService::buildBreadcrumbFromFolder($folder),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Folder $folder): Response
    {
        return inertia('folders/edit', [
            'folder' => $folder,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFolderRequest $request, Folder $folder): RedirectResponse
    {
        $folder->update($request->validated());

        return to_route('folders.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder): RedirectResponse
    {
        // TODO: need to also delete folder from storage ?
        // may need to keep folder in storage in case of restore ?
        try {
            Storage::disk('minio')->deleteDirectory($folder->path);
            $folder->delete();
        }
        catch (Exception $exception) {
            report($exception);
        }

        return to_route('folders.index');
    }
}
