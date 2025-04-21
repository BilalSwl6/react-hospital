<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Generic extends Model
{
    use HasFactory;

    protected $table = 'generics';

    protected $fillable = [
        'generic_name',
        'generic_description',
        'therapeutic_class',
        'generic_category',
        'generic_subcategory',
        'generic_notes',
        'generic_status',
    ];

    public function medicines()
    {
        return $this->hasMany(Medicine::class);
    }

}
