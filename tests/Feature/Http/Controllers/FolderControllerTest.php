<?php

declare(strict_types=1);

describe('FolderController', function () {
    it('can display a listing of folders resources', function () {
        $this->get(route('folders.index'))->assertOk();
    });
});
