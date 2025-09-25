<?php

declare(strict_types=1);

namespace App\Actions\DriveFileShare;

use App\Enums\DriveFilePermissionEnum;
use App\Enums\DriveFileShareExpiresAtEnum;
use App\Models\DriveFile;
use App\Models\DriveFileShare;
use App\Models\User;
use DateTimeInterface;
use Illuminate\Support\Str;

class CreateNewDriveFileShare
{
    /**
     * @param array{expires_in: string, permission: string} $data
     */
    public function handle(DriveFile $file, array $data, ?User $sharedWithUser): DriveFileShare
    {
        $expiresAt = $this->setupExpiresAt($data['expires_in']);
        $permission = DriveFilePermissionEnum::tryFrom($data['permission'])->value ?? DriveFilePermissionEnum::READ->value;

        $payload = [
            'drive_file_id'       => $file->id,
            'shared_with_user_id' => $sharedWithUser->id ?? null,
            'permission'          => $permission,
            'expires_at'          => $expiresAt,
            'public_token'        => Str::uuid7()->toString(),
        ];

        return DriveFileShare::create($payload);
    }

    private function setupExpiresAt(string $expiresIn): ?DateTimeInterface
    {
        return match (Str::lower($expiresIn)) {
            DriveFileShareExpiresAtEnum::ONE_DAY->value     => now()->addDay(),
            DriveFileShareExpiresAtEnum::SEVEN_DAYS->value  => now()->addWeek(),
            DriveFileShareExpiresAtEnum::THIRTY_DAYS->value => now()->addMonth(),
            DriveFileShareExpiresAtEnum::NEVER->value       => now()->addCentury(),
            default                                         => null,
        };
    }
}
