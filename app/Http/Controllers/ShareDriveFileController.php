<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateNewDriveFileShare;
use App\Http\Requests\ShareDriveFileRequest;
use App\Models\DriveFile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

class ShareDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(ShareDriveFileRequest $request, DriveFile $file, CreateNewDriveFileShare $createNewDriveFileShareAction): JsonResponse
    {
        $input = $request->validated();
        $sharedWithUser = User::query()->where('user_email', $input['user_email'])->first();

        $share = $createNewDriveFileShareAction->handle($file, $input, $sharedWithUser);
        $signedUrl = URL::temporarySignedRoute(
            'files.shared',
            Carbon::parse($share->expires_at),
            ['token' => $share->public_token]
        );

        return response()->json([
            'share'      => $share,
            'share_link' => $signedUrl,
        ]);
    }
}
