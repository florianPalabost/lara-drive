<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        // TODO: refactor breadcrumbs service & move to service
        $breadcrumbs = [
            ['title' => 'Home', 'href' => route('home')],
            ['title' => 'Dashboard', 'href' => route('dashboard')],
        ];

        return inertia('dashboard', [
            'breadcrumbs' => $breadcrumbs,
        ]);
    }
}
