<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Folder\StoreFolderRequest;
use App\Http\Requests\Folder\UpdateFolderRequest;
use App\Models\Folder;
use Inertia\Response;
use Spatie\QueryBuilder\QueryBuilder;

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
    // public function store(StoreFolderRequest $request)
    // {
    //     $input = $request->validated();

    //     if ($input['parent_id']) {
    //         $parentFolder = Folder::find($input['parent_id'])->first();
    //         $folder       = $parentFolder->children()->create($input);
    //     } else {
    //         $folder = Folder::create($request->validated());
    //     }

    //     return $folder;
    // }

    /**
     * Display the specified resource.
     */
    public function show(Folder $folder)
    {
        $folder = QueryBuilder::for(Folder::class)
            ->allowedIncludes(['children'])
            ->findOrFail($folder->id);

        // TODO: Inertia view
        return $folder;
    }

    // TODO: edit Inertia view

    /**
     * Update the specified resource in storage.
     */
    // public function update(UpdateFolderRequest $request, Folder $folder)
    // {
    //     $folder->update($request->validated());

    //     return $folder;
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        Folder::destroy($folder->id);

        return response()->noContent();
    }
}
