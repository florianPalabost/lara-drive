<?php

declare(strict_types=1);

use Illuminate\Testing\TestResponse;
use Pest\Expectation;
use Pest\Expectations\EachExpectation;
use Pest\Expectations\HigherOrderExpectation;
use Pest\Expectations\OppositeExpectation;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "uses()" function to bind a different classes or traits.
|
*/

uses(TestCase::class, Illuminate\Foundation\Testing\LazilyRefreshDatabase::class)->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

expect()->extend('toBeSuccessfulApiResponse', function () {
    return $this->toBeJson()->json()
        ->toHaveKey('data')
        ->data->not()->toBeEmpty();
});

expect()->extend('toBeErrorApiResponse', function () {
    return $this->toBeJson()->json()
        ->toHaveKey('errors')
        ->errors->not()->toBeEmpty();
});

expect()->extend('toBeSuccessfulApiResponsePaginated', function () {
    return $this->toBeJson()->json()
        ->toHaveKey('data')
        ->data->not()->toBeEmpty()
        ->toHaveKey('links')
        ->toHaveKey('meta');
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * Assert that the response match the default successful api response
 */
function expectSuccessfulApiResponse(TestResponse $response, int $httpStatus = Response::HTTP_OK): Expectation|OppositeExpectation|int|EachExpectation|HigherOrderExpectation
{
    $method = match ($httpStatus) {
        Response::HTTP_CREATED => 'toBeCreated',
        default                => 'toBeSuccessful'
    };

    return expect($response->getStatusCode())->$method()
        ->and($response->getContent())->toBeSuccessfulApiResponse();
}
