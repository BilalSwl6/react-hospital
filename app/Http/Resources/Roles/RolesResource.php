<?php

namespace App\Http\Resources\Roles;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RolesResource extends JsonResource
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
            'guard_name' => $this->guard_name,
            'permissions' => $this->permissions->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                ];
            }),
            'permission_name' => $this->permissions->pluck('name'),
        ];
    }
}
