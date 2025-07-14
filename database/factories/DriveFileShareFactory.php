<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\DriveFile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DriveFileShare>
 */
class DriveFileShareFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'drive_file_id'       => DriveFile::factory(),
            'shared_with_user_id' => User::factory(),
            'public_token'        => Str::uuid7(),
            'permission'          => 'read',
            'expires_at'          => now()->addDays(7),
        ];
    }
}
