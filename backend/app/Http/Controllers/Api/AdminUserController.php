<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Fetch all non-admin users, including providers
        $users = User::where('role', '!=', 'admin')->orderBy('created_at', 'desc')->get();
        return response()->json($users);
    }

    public function stats()
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $usersCount = User::where('role', 'user')->count();
        $bookingsCount = \App\Models\Booking::where('status', '!=', 'cancelled')->count();
        $servicesCount = \App\Models\Service::count();
        $revenue = \App\Models\Booking::where('payment_status', 'completed')->sum('total_price') ?? 0;

        // If no bookings yet, maybe sum returns null
        return response()->json([
            'users' => $usersCount,
            'bookings' => $bookingsCount,
            'services' => $servicesCount,
            'revenue' => (float) $revenue
        ]);
    }

    public function toggleBlock($id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot block an admin'], 403);
        }

        $user->is_blocked = !$user->is_blocked;
        $user->save();

        return response()->json([
            'message' => $user->is_blocked ? 'User blocked successfully' : 'User unblocked successfully',
            'user' => $user
        ]);
    }

    public function destroy($id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete an admin'], 403);
        }

        // Optionally, delete related bookings or requests here.
        // For MongoDB, we can manually delete them if desired.
        // \App\Models\ProviderRequest::where('user_id', $user->id)->delete();
        // \App\Models\Booking::where('user_id', $user->id)->delete();

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
