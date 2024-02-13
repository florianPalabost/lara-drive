<?php

declare(strict_types=1);

namespace App\Http\Requests\Folder;

use Illuminate\Foundation\Http\FormRequest;

class StoreFolderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'      => 'required|string|max:255',
            'path'      => 'required|string|max:255',
            // 'created_by' => 'required|uuid|exists:users,id',
            'parent_id' => 'nullable|uuid|exists:folders,id',
        ];
    }
}
