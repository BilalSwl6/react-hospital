<?php

namespace App\Http\Resources\Drugdept\Generic;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GenericResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->generic_name,
            'description' => $this->generic_description,
            'therapeutic_class' => $this->therapeutic_class,
            'category' => $this->generic_category,
            'sub_category' => $this->generic_subcategory,
            'notes' => $this->generic_notes,
            'status' => $this->generic_status,
        ];
    }
}
