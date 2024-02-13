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
            'id'         => $this->id,
            'name'       => $this->name,
            'path'       => $this->path,
            'created_by' => UserResource::make($this->whenLoaded('created_by')),
            'parent'     => FolderResource::make($this->whenLoaded('parent')),
            'children'   => FolderResource::collection($this->whenLoaded('children')),
            'files'      => CustomFileResource::collection($this->whenLoaded('files')),
        ];
    }
}
