<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateNewDriveFileShare;
use App\Http\Requests\ShareDriveFileRequest;
use App\Models\DriveFile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class ShareDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(ShareDriveFileRequest $request, DriveFile $file, CreateNewDriveFileShare $createNewDriveFileShareAction): Response
    {
        $user = auth()->user();

        abort_if($file->user_id !== $user->id, Response::HTTP_FORBIDDEN);

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
