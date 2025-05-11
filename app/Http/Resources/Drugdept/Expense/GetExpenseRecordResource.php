<?php

namespace App\Http\Resources\Drugdept\Expense;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GetExpenseRecordResource extends JsonResource
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
            'ward_name' => $this->ward->ward_name,
            'date' => $this->date,
        ];
    }
}
