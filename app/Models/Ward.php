<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    use HasFactory;

    protected $table = 'wards';

    protected $fillable = [
        'ward_name',
        'ward_description',
        'ward_capacity',
        'ward_status',
    ];

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
