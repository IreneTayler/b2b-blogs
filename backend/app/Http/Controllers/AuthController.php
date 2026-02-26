<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'api_token' => Str::random(80),
        ]);

        return response()->json([
            'user' => $user,
            'token' => $user->api_token,
        ], Response::HTTP_CREATED);
    }

    /**
     * Log in (validate credentials and return user; stateless).
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user->forceFill(['api_token' => Str::random(80)])->save();

        return response()->json([
            'user' => $user,
            'token' => $user->api_token,
        ]);
    }

    /**
     * Log out (no-op for stateless API; client clears token/state).
     */
    public function logout(Request $request)
    {
        return response()->json(['message' => 'Logged out']);
    }

    /**
     * Unsubscribe: delete the user account after verifying email and password.
     */
    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user->delete();

        return response()->json(['message' => 'Account deleted successfully.']);
    }
}
