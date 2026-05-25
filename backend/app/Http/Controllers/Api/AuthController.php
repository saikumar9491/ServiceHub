<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // First check if user exists but is unverified (they might be trying to register again)
        $existingUser = User::where('email', $request->email)->first();
        if ($existingUser && $existingUser->email_verified_at === null) {
            // Re-use the existing user
            $user = $existingUser;
            $user->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);
        } else {
            $request->validate(['email' => 'required|email|unique:users']);
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);
        }

        // Generate 6-digit OTP as a string
        $otp = (string) rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expires_at = Carbon::now()->addMinutes(15);
        $user->save();

        // Send OTP via Email
        Mail::send('emails.otp', ['otp' => $otp], function($message) use ($user) {
            $message->to($user->email)->subject('Verify Your Account - OTP');
        });

        return response()->json(['message' => 'OTP sent to your email', 'require_otp' => true, 'email' => $user->email]);
    }

    public function resendRegistrationOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $otp = (string) rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expires_at = Carbon::now()->addMinutes(15);
        $user->save();

        Mail::send('emails.otp', ['otp' => $otp], function($message) use ($user) {
            $message->to($user->email)->subject('Verify Your Account - OTP');
        });

        return response()->json(['message' => 'A new OTP has been sent to your email']);
    }

    public function verifyRegistrationOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric'
        ]);

        $user = User::where('email', $request->email)
                    ->where(function ($query) use ($request) {
                        $query->where('otp', $request->otp)
                              ->orWhere('otp', (int) $request->otp);
                    })
                    ->first();

        if (!$user || Carbon::parse($user->otp_expires_at)->isPast()) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }

        // Mark as verified
        $user->email_verified_at = Carbon::now();
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return response()->json([
            'message' => 'Account verified successfully', 
            'user' => $user, 
            'token' => $user->createToken('auth_token')->plainTextToken
        ]);
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if ($user->is_blocked) {
            return response()->json(['message' => 'Your account has been blocked by an administrator'], 403);
        }

        // Auto-upgrade specific user to admin
        if ($user->email === 'balisaikumar9491@gmail.com' && $user->role !== 'admin') {
            $user->role = 'admin';
            $user->save();
        }

        return response()->json(['user' => $user, 'token' => $user->createToken('auth_token')->plainTextToken]);
    }

    // --- FORGOT PASSWORD ---

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Generate 6-digit OTP as a string
        $otp = (string) rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expires_at = Carbon::now()->addMinutes(15);
        $user->save();

        // Send OTP via Email
        try {
            Mail::send('emails.otp', ['otp' => $otp], function($message) use ($user) {
                $message->to($user->email)->subject('Your Password Reset OTP');
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Email failed: ' . $e->getMessage()], 500);
        }

        return response()->json(['message' => 'OTP sent to your email']);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric'
        ]);

        $user = User::where('email', $request->email)
                    ->where(function ($query) use ($request) {
                        $query->where('otp', $request->otp)
                              ->orWhere('otp', (int) $request->otp);
                    })
                    ->first();

        if (!$user || Carbon::parse($user->otp_expires_at)->isPast()) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }

        return response()->json(['message' => 'OTP verified successfully']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric',
            'password' => 'required|min:6'
        ]);

        $user = User::where('email', $request->email)
                    ->where(function ($query) use ($request) {
                        $query->where('otp', $request->otp)
                              ->orWhere('otp', (int) $request->otp);
                    })
                    ->first();

        if (!$user || Carbon::parse($user->otp_expires_at)->isPast()) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }

        $user->password = Hash::make($request->password);
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return response()->json(['message' => 'Password reset successfully']);
    }

    // --- GOOGLE LOGIN ---

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $user = User::where('google_id', $googleUser->id)->orWhere('email', $googleUser->email)->first();

            if ($user) {
                // Update Google ID if it was matched by email
                $user->update(['google_id' => $googleUser->id]);
            } else {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'password' => Hash::make(Str::random(16)), // Random password for oauth
                    'role' => 'user'
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect to frontend with token
            $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
            return redirect($frontendUrl . '/auth/callback?token=' . $token);

        } catch (\Exception $e) {
            \Log::error('Google Login Error: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
            $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
            return redirect($frontendUrl . '/login?error=' . urlencode($e->getMessage()));
        }
    }
}
