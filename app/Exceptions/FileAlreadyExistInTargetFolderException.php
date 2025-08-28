<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

class FileAlreadyExistInTargetFolderException extends RuntimeException
{
    /** @var int */
    protected $code = 409;

    /** @var string */
    protected $message = 'File %s already exist in target folder';

    public function __construct(string $fileName, ?Throwable $previous = null)
    {
        $this->message = sprintf($this->message, $fileName);

        parent::__construct(message: $this->message, code: $this->code, previous: $previous);
    }
}
