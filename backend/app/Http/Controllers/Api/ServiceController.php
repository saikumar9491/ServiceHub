<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query();
        if ($request->has('category')) { $query->where('category', $request->category); }
        if ($request->has('search')) { $query->where('service_name', 'like', '%' . $request->search . '%'); }
        return response()->json($query->get());
    }

    public function show($id)
    {
        $service = Service::find($id);
        return $service ? response()->json($service) : response()->json(['message' => 'Not found'], 404);
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'category' => 'required|string',
            'description' => 'required|string',
            'provider_id' => 'required|string',
            'image_url' => 'nullable|string'
        ]);

        $service = Service::create([
            'service_name' => $request->service_name,
            'price' => (float)$request->price,
            'category' => $request->category,
            'description' => $request->description,
            'provider_id' => $request->provider_id,
            'image_url' => $request->image_url,
            'rating' => 0,
            'reviews_count' => 0
        ]);

        return response()->json(['message' => 'Service created successfully', 'service' => $service], 201);
    }
}
