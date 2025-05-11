<?php

namespace App\Http\Resources\Drugdept\Ward;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GetWardResource extends JsonResource
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
            'name' => $this->ward_name,
        ];
    }
}
