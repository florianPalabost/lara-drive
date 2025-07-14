<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDriveFileRequest extends FormRequest
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
            'folder_id' => ['required', Rule::exists('folders', 'uuid')],
            'file'      => ['required', 'file', 'max:102400'], // 100 mb => 102400 kb
        ];
    }
}
