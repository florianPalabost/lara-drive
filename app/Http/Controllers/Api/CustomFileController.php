<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomFile\StoreCustomFileRequest;
use App\Http\Requests\CustomFile\UpdateCustomFileRequest;
use App\Http\Resources\CustomFileResource;
use App\Models\CustomFile;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;
use Symfony\Component\HttpFoundation\Response;

class CustomFileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Folder $folder): AnonymousResourceCollection
    {
        $customFiles = QueryBuilder::for(subject: CustomFile::class)
            ->allowedFields(fields: ['id', 'name', 'size', 'extension', 'created_by'])
            ->allowedFilters(filters: ['name', 'extension'])
            ->allowedIncludes(includes: ['createdBy'])
            ->where(column: 'folder_id', operator: '=', value: $folder->id)
            ->jsonPaginate();

        return CustomFileResource::collection(resource: $customFiles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomFileRequest $request): CustomFileResource
    {

        $input = $request->validated();

        abort_if(! $input, Response::HTTP_BAD_REQUEST, 'No input provided');

        if ($request->hasFile('file')) {
            $input['size']       = $request->file('file')->getSize();
            $input['extension']  = $request->file('file')->getClientOriginalExtension();
            $input['created_by'] = User::inRandomOrder()->first()->uuid;
        }

        $customFile = CustomFile::create($input);

        if ($request->hasFile('file')) {
            $customFile->addMediaFromRequest('file')->toMediaCollection('uploads');
        }

        return new CustomFileResource($customFile);
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomFile $customFile): CustomFileResource
    {
        $customFile = QueryBuilder::for(subject: CustomFile::class)
            ->allowedFields(fields: ['id', 'name', 'size', 'extension', 'created_by'])
            ->allowedIncludes(includes: ['createdBy'])
            ->findOrFail(id: $customFile->id);

        return new CustomFileResource($customFile);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomFileRequest $request, CustomFile $customFile): CustomFileResource
    {
        $input = $request->validated();

        abort_if(! $input, Response::HTTP_BAD_REQUEST, 'No input provided');

        $customFile->update($input);

        return new CustomFileResource($customFile);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomFile $customFile): Response
    {
        $customFile->delete();

        return response()->noContent();
    }
}
