<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Folder
 */
class FolderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'path'            => $this->path,
            'created_by'      => UserResource::make($this->whenLoaded('created_by')),
            'parent'          => FolderResource::make($this->whenLoaded('parent')),
            'children'        => FolderResource::collection($this->whenLoaded('children')),
            'files'           => CustomFileResource::collection($this->whenLoaded('files')),

            'parent_count'    => $this->whenCounted('parent'),
            'children_count'  => $this->whenCounted('children'),
            'files_count'     => $this->whenCounted('files'),

            'parent_exists'   => $this->whenHas('parent_exists'),
            'children_exists' => $this->whenHas('children_exists'),
            'files_exists'    => $this->whenHas('files_exists'),
        ];
    }
}
