<?php

declare(strict_types=1);

namespace App\Http\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Support\Arr;
use Illuminate\Validation\Validator;
use LogicException;

class ArrayExistModelIds implements ValidationRule, ValidatorAwareRule
{
    protected Validator $validator;

    public function __construct(
        protected string $modelClass
    ) {}

    public function setValidator(Validator $validator): static
    {
        $this->validator = $validator;

        return $this;
    }

    /**
     * Run the validation rule.
     *
     * @param Closure(string): \Illuminate\Translation\PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (is_array($value) === false) {
            throw new LogicException('This rule does not support non-array values.');
        }

        // allow empty values (ex: remove all links between two models by passing an empty array)
        if ($value === []) {
            return;
        }

        // fetch existing attribute ids with one sql request(in(...)) instead of making one per id
        $existingModelIds = $this->modelClass::whereIn(column: 'uuid', values: $value)->pluck('uuid')->flip()->toArray();

        // if no ids exist then we can fail immediately since no model seems to exist
        if ($existingModelIds === []) {
            $fail('The different :attribute are invalid.');

            return;
        }

        foreach ($value as $index => $modelId) {
            if (Arr::has(array: $existingModelIds, keys: $modelId) === false) {
                $attributeKey = sprintf('%s.%d', $attribute, $index);
                $this->validator->errors()->add(
                    key: $attributeKey,
                    message: sprintf('The %s is invalid.', $attributeKey)
                );
            }
        }
    }
}
