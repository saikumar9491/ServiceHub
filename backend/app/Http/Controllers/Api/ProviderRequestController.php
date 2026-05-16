<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProviderRequest;
use App\Models\User;
use Illuminate\Http\Request;

class ProviderRequestController extends Controller
{
    // For Users: Submit a new request
    public function store(Request $request)
    {
        $request->validate([
            'business_name' => 'required|string',
            'service_category' => 'required|string',
            'experience_years' => 'required|integer',
        ]);

        // Check if user already has a pending request
        $existing = ProviderRequest::where('user_id', auth()->id())
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You already have a pending application.'], 400);
        }

        $providerRequest = ProviderRequest::create([
            'user_id' => auth()->id(),
            'business_name' => $request->business_name,
            'service_category' => $request->service_category,
            'experience_years' => $request->experience_years,
            'status' => 'pending',
        ]);

        return response()->json($providerRequest, 201);
    }

    // For Admins: Get all requests
    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $requests = ProviderRequest::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($requests);
    }

    // For Admins: Approve request
    public function approve($id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $providerRequest = ProviderRequest::find($id);

        if (!$providerRequest) {
            return response()->json(['message' => 'Request not found'], 404);
        }

        $providerRequest->status = 'approved';
        $providerRequest->save();

        // Upgrade user to provider
        $user = User::find($providerRequest->user_id);
        if ($user) {
            $user->role = 'provider';
            $user->save();
        }

        return response()->json(['message' => 'Provider approved successfully']);
    }

    // For Admins: Reject request
    public function reject($id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $providerRequest = ProviderRequest::find($id);

        if (!$providerRequest) {
            return response()->json(['message' => 'Request not found'], 404);
        }

        $providerRequest->status = 'rejected';
        $providerRequest->save();

        return response()->json(['message' => 'Provider request rejected']);
    }
}
