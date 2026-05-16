<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $user = User::where('email', 'balisaikumar9491@gmail.com')->first();
        if ($user) {
            $user->role = 'admin';
            $user->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $user = User::where('email', 'balisaikumar9491@gmail.com')->first();
        if ($user) {
            $user->role = 'user';
            $user->save();
        }
    }
};
