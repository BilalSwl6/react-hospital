<?php

namespace App\Http\Resources\Drugdept\Medicine;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GetMedicineForExpenseResource extends JsonResource
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
            'name' => $this->name,
            'generic_id' => $this->generic_id,
            'generic_name' => $this->generic->generic_name,
            'quantity' => $this->quantity,
            'strength' => $this->strength,
            'route' => $this->route,
            'category' => $this->category,
            'manufacturer' => $this->manufacturer,
        ];
    }
}
