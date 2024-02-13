<?php

declare(strict_types=1);

describe('CustomFileController', function () {
    it('can display a listing of files resources', function () {
        $this->get(route('custom-files.index'))->assertOk();
    });
});
