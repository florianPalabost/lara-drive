<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomFile\StoreCustomFileRequest;
use App\Http\Requests\CustomFile\UpdateCustomFileRequest;
use App\Models\CustomFile;
use App\Models\Folder;

class CustomFileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Folder $folder)
    {
        $customFiles = $folder->files()->paginate(30);

        return $customFiles;

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomFileRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomFile $customFile)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomFileRequest $request, CustomFile $customFile)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomFile $customFile)
    {
        //
    }
}
