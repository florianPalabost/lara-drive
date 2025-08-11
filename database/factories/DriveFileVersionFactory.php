<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\DriveFile;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DriveFileVersion>
 */
class DriveFileVersionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid'          => Str::uuid7()->toString(),
            'drive_file_id' => DriveFile::factory(),
            'is_current'    => true,
            'version'       => 1,
            'path'          => fake()->filePath(),
            'size'          => fake()->randomNumber(),
            'mime_type'     => fake()->mimeType(),
        ];
    }
}
