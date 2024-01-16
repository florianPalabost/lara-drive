<?php

describe('FolderController', function () {
    it('can display a listing of folders resources', function () {
        $this->get(route('folders.index'))->assertOk();
    });
});
