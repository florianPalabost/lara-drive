<?php

declare(strict_types=1);

namespace App\Http\Requests\Folder;

use App\Http\Rules\ArrayExistModelIds;
use App\Models\Folder;
use Illuminate\Foundation\Http\FormRequest;

class MoveFolderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'folder_ids'       => ['required', 'array', new ArrayExistModelIds(Folder::class)],
            'target_folder_id' => ['required', 'exists:folders,uuid'],
        ];
    }
}
