<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Resources\Users\UserResource;

class ManageUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::with('roles:name')->paginate(25);
        $roles = Role::select('name', 'id')->get();
        return Inertia::render('Admin/Users/Index', [
            'users' => UserResource::collection($user),
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'array',
            'role.*' => 'string|exists:roles,name',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);
        $user->syncRoles($validated['role'] ?? []);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($id)],
            'password' => 'nullable|string|min:8',
            'role' => 'array',
            'role.*' => 'string|exists:roles,name',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user = User::findOrFail($id);
        $user->update($validated);
        $user->syncRoles($validated['role'] ?? []);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        try {
            $user->delete();

            return redirect()->back()->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete user.');
        }
    }
}
