<?php

declare(strict_types=1);

namespace App\Http\Controllers\DriveFileShare;

use App\Http\Controllers\Controller;
use App\Models\DriveFileShare;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SharedDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $token = $request->route('token');

        $driveFileShare = DriveFileShare::query()
            ->with('driveFile')
            ->where('public_token', $token)
            ->firstOrFail();

        abort_unless($driveFileShare->expires_at > now(), Response::HTTP_GONE);

        // handle shared with user
        if ($driveFileShare->shared_with_user_id) {
            if (! auth()->check()) {
                // TODO NOK
                return redirect()->setIntendedUrl(route('files.shared', $driveFileShare->public_token))->route('login');
            }

            abort_unless(auth()->user()->id === $driveFileShare->shared_with_user_id, Response::HTTP_FORBIDDEN);
        }

        return to_route('files.download', ['uuid' => $driveFileShare->driveFile->uuid]);
    }
}
