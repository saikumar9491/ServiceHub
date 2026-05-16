<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class ProviderRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'service_category',
        'experience_years',
        'status', // 'pending', 'approved', 'rejected'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
