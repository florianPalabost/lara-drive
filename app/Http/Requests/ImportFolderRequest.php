<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ImportFolderRequest extends FormRequest
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
     * @return ValidationRules
     */
    public function rules(): array
    {
        return [
            'base_folder_id' => ['required', Rule::exists('folders', 'uuid')],
            'files'          => ['required', 'array'],
            'files.*'        => ['required', 'file'],
            'paths'          => ['required', 'array'],
            'paths.*'        => ['required', 'string'],
        ];
    }
}
