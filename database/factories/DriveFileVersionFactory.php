<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\DriveFile;
use App\Models\DriveFileVersion;
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
            'version'       => function (array $attributes) {
                // If a drive_file_id is passed, increment based on its existing versions
                if (isset($attributes['drive_file_id'])) {
                    $last = DriveFileVersion::query()
                        ->where('drive_file_id', $attributes['drive_file_id'])
                        ->max('version');

                    return ($last ?? 0) + 1;
                }

                return 1;
            },
            'path'          => fake()->filePath(),
            'size'          => fake()->randomNumber(),
            'mime_type'     => fake()->mimeType(),
        ];
    }
}
