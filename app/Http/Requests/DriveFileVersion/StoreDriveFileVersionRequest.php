<?php

declare(strict_types=1);

namespace App\Http\Requests\DriveFileVersion;

use App\Enums\ResourcePermissionEnum;
use App\Services\ResourcePermissionService;
use Illuminate\Foundation\Http\FormRequest;

class StoreDriveFileVersionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return app(ResourcePermissionService::class)->can(
            user: auth()->user(),
            resource: $this->route('file'),
            action: ResourcePermissionEnum::EDIT
        );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return ValidationRules
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:102400'],
        ];
    }
}
