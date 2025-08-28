<?php

declare(strict_types=1);

use App\Bootstrappers\ExceptionsBootstrapper;
use App\Bootstrappers\MiddlewareBootstrapper;
use App\Bootstrappers\RoutingBootstrapper;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

// return Application::configure(basePath: dirname(__DIR__))
//     ->withRouting(
//         web: __DIR__ . '/../routes/web.php',
//         commands: __DIR__ . '/../routes/console.php',
//         health: '/up',
//     )
//     ->withMiddleware(function (Middleware $middleware) {
//         $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

//         $middleware->web(append: [
//             HandleAppearance::class,
//             HandleInertiaRequests::class,
//             AddLinkHeadersForPreloadedAssets::class,
//         ]);
//     })
//     ->withExceptions(function (Exceptions $exceptions) {})->create();

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(using: (new RoutingBootstrapper)(...))
    ->withMiddleware(callback: (new MiddlewareBootstrapper)(...))
    ->withExceptions(using: (new ExceptionsBootstrapper)(...))
    ->withCommands([base_path('routes/console.php')])
    ->withBroadcasting(base_path('routes/channels.php'))
    ->create();
