<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreFolderRequest;
use App\Http\Requests\UpdateFolderRequest;
use App\Models\Folder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Response;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $folders = Folder::query()->whereNull('parent_id')
            ->with('children', 'files')
            ->where('user_id', auth()->user()->id)
            ->orderBy('name')
            ->get();

        return inertia('folders/index', [
            'folders' => $folders,
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

        $folder = Folder::create([
            ...$input,
            'parent_id' => $parentFolder->id ?? null,
            'path'      => $parentFolder ? $parentFolder->path . '/' . $parentFolder->uuid : '/',
            'user_id'   => auth()->user()->id,
        ]);

        return to_route('folders.index', ['folder' => $folder]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Folder $folder) {}

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
    public function update(UpdateFolderRequest $request, Folder $folder) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder): RedirectResponse
    {
        $folder->delete();

        return to_route('folders.index');
    }
}
