<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Folder;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DriveFile>
 */
class DriveFileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $file = fake()->file('files');

        return [
            'uuid'          => Str::uuid()->toString(),
            'folder_id'     => Folder::factory(),
            'original_name' => basename($file),
            'mime_type'     => mime_content_type($file),
            'size'          => filesize($file),
            'path'          => $file,
        ];
    }
}
