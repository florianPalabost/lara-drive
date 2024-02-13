<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Folder\StoreFolderRequest;
use App\Http\Requests\Folder\UpdateFolderRequest;
use App\Http\Resources\FolderResource;
use App\Models\Folder;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;
use Symfony\Component\HttpFoundation\Response;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $folders = QueryBuilder::for(Folder::class)
            ->allowedFields(fields: ['id', 'name', 'path', 'created_by'])
            ->allowedIncludes(includes: ['files', 'children', 'parent', 'createdBy'])
            ->allowedFilters(filters: ['name', 'path'])
            ->allowedSorts(sorts: ['name', 'created_by', 'created_at'])
            ->jsonPaginate();

        return FolderResource::collection($folders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFolderRequest $request): FolderResource
    {
        $input = $request->validated();

        abort_if(! $input, Response::HTTP_BAD_REQUEST, 'No input provided');

        if ($input['parent_id']) {
            $parentFolder = Folder::find($input['parent_id'])->first();
            $folder       = $parentFolder->children()->create($input);
        } else {
            $folder = Folder::create($request->validated());
        }

        return new FolderResource($folder);
    }

    /**
     * Display the specified resource.
     */
    public function show(Folder $folder): FolderResource
    {
        $folder = QueryBuilder::for(Folder::class)
            ->allowedFields(fields: ['id', 'name', 'path', 'created_by'])
            ->allowedIncludes(['children', 'parent', 'files', 'createdBy'])
            ->findOrFail($folder->id);

        return new FolderResource($folder);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFolderRequest $request, Folder $folder): FolderResource
    {
        $input = $request->validated();

        abort_if(! $input, Response::HTTP_BAD_REQUEST, 'No input provided');

        $folder->update($request->validated());

        return new FolderResource($folder);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder): Response
    {
        Folder::destroy($folder->id);

        return response()->noContent();
    }
}
