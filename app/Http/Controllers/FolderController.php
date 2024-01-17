<?php

namespace App\Http\Controllers;

use App\Http\Requests\Folder\StoreFolderRequest;
use App\Http\Requests\Folder\UpdateFolderRequest;
use App\Models\Folder;
use Inertia\Response;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        // no paginate since the root folders should not be paginated
        $folderTree = Folder::withDepth()
            ->whereIsRoot()
            ->get()
            ->toTree();

        // Todo: see Inertia
        return inertia('Folders/Index', ['folderTree' => $folderTree]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFolderRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Folder $folder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFolderRequest $request, Folder $folder)
    {
        $folder->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        //
    }
}
