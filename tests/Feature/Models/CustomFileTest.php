<?php

use App\Models\CustomFile;
use App\Models\Folder;
use App\Models\User;

describe('CustomFile', function () {

    it('can be created', function () {
        $customFile = CustomFile::factory()->create();
        expect($customFile)->toBeInstanceOf(CustomFile::class);
    });

    it('has a folder', function () {
        $folder     = Folder::factory()->create();
        $customFile = $folder->files()->save(CustomFile::factory()->create());

        expect($customFile->folder)->toBeInstanceOf(Folder::class);
    });

    it('has a created_by user', function () {
        $user       = User::factory()->create();
        $customFile = $user->files()->save(CustomFile::factory()->create());
        expect($customFile->created_by)->toBeInstanceOf(User::class);
    });

    it('has a path', function () {
        $customFile = CustomFile::factory()->create();
        expect($customFile->path)->toBeString();
    });

    it('has a name', function () {
        $customFile = CustomFile::factory()->create();
        expect($customFile->name)->toBeString();
    });

    it('has an extension', function () {
        $customFile = CustomFile::factory()->create();
        expect($customFile->extension)->toBeString();
    });

    it('has a size', function () {
        $customFile = CustomFile::factory()->create();
        expect($customFile->size)->toBeInt();
    });
});
