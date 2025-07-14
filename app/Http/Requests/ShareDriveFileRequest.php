<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\DriveFilePermissionEnum;
use App\Enums\DriveFileShareExpiresAtEnum;
use Illuminate\Foundation\Http\FormRequest;

class ShareDriveFileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->id === request()->route('file')->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_email' => ['nullable', 'exists:users,email'],
            'expires_in' => ['nullable', 'in:' . collect(DriveFileShareExpiresAtEnum::cases())->map(fn (DriveFileShareExpiresAtEnum $permission) => $permission->value)->implode(',')],
            'permission' => ['required', 'in:' . collect(DriveFilePermissionEnum::cases())->map(fn (DriveFilePermissionEnum $permission) => $permission->value)->implode(',')],
        ];
    }
}
