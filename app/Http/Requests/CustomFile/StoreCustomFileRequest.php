<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomFile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreCustomFileRequest extends FormRequest
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
            'size'      => 'sometimes|number',
            'extension' => 'sometimes|string|max:255',
            // 'created_by' => 'required|uuid|exists:users,id',
            // 'folder_id' => 'required|uuid|exists:folders,id',
            'is_public' => 'sometimes|boolean',
        ];
    }

    protected function passedValidation()
    {

        $this->safe()->merge([
            'name' => Str::slug($this->name, '-'),
        ]);
    }
}
