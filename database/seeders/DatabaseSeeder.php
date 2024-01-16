<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\CustomFile;
use App\Models\Folder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // Create tree
        $rootFolders = Folder::factory(5)->create();

        $rootFolders->each(function ($folder) {
            Folder::factory(random_int(0, 3))->create([
                'parent_id' => $folder->id,
            ]);
        });

        $folders = Folder::all();

        $folders->some(function (Folder $folder) {
            $folder->files()->saveMany(CustomFile::factory(random_int(0, 10))->create([
                'folder_id' => $folder->id,
            ]));
        });
    }
}
