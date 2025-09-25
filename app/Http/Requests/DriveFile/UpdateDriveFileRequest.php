<?php

declare(strict_types=1);

namespace App\Http\Requests\DriveFile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDriveFileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return ValidationRules
     */
    public function rules(): array
    {
        return [

        ];
    }
}
