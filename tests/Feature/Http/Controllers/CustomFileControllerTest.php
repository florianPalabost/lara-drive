<?php

describe('CustomFileController', function () {
    it('can display a listing of files resources', function () {
        $this->get(route('custom-files.index'))->assertOk();
    });
});
