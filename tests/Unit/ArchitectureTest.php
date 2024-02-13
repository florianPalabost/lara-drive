<?php

declare(strict_types=1);

uses()->group('arch');

test('debug functions should NOT be used', function () {
    $debugFunctions = ['dd', 'dump', 'ray', 'print_r', 'var_dump'];
    expect($debugFunctions)->not()->tobeUsed();
});

test('env function only used in config', function () {
    expect(['env'])->not->tobeUsed();
});

test('strict type is declared', function () {
    expect('App')->toUseStrictTypes();
});

test('Controllers')->expect('App\Http\Controllers')->toHaveSuffix('Controller');
test('Requests')->expect('App\Http\Requests')->toHaveSuffix('Request');
test('Resources')->expect('App\Http\Resources')->toHaveSuffix('Resource');
test('Enums')->expect('App\Enums')->toBeEnums();
test('Enum suffix')->expect('App\Enums')->toHaveSuffix('Enum');
test('Observers')->expect('App\Observers')->toHaveSuffix('Observer');
test('Traits')->expect('App\Traits')->toBeTraits();
