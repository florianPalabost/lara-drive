<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Folder;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CustomFile>
 */
class CustomFileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'       => $this->faker->name(),
            'size'       => random_int(0, 1000),
            'path'       => storage_path('/' . $this->faker->word()),
            'extension'  => $this->faker->fileExtension(),
            'created_by' => User::inRandomOrder()->first()->uuid,
            'folder_id'  => Folder::inRandomOrder()->first()->id,
        ];
    }
}
