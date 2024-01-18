<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomFile\StoreCustomFileRequest;
use App\Http\Requests\CustomFile\UpdateCustomFileRequest;
use App\Models\CustomFile;
use App\Models\Folder;
use App\Models\User;

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

        $input = $request->validated();
        if ($request->hasFile('file')) {
            $input['size']       = $request->file('file')->getSize();
            $input['extension']  = $request->file('file')->getClientOriginalExtension();
            $input['created_by'] = User::inRandomOrder()->first()->uuid;
            $customFile          = CustomFile::create($input);
            $customFile->addMedia($request->file('file'))->toMediaCollection('uploads');
        }

        return redirect()->back();
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
