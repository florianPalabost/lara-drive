<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Folder>
 */
class FolderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $filePath = storage_path('/' . $this->faker->word());

        return [
            'name'       => $this->faker->name(),
            'created_by' => User::inRandomOrder()->first()->uuid,
            'parent_id'  => null,
            'path'       => $filePath,
        ];
    }
}
