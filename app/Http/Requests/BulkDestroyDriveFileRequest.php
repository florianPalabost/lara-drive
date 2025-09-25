<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Http\Rules\ArrayExistModelIds;
use App\Models\DriveFile;
use Illuminate\Foundation\Http\FormRequest;

class BulkDestroyDriveFileRequest extends FormRequest
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
            'file_ids' => ['required', 'array', new ArrayExistModelIds(modelClass: DriveFile::class, withTrashed: true)],
        ];
    }
}
