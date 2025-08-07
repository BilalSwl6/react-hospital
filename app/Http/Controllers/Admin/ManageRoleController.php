<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Roles\RolesResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ManageRoleController extends Controller
{
    public function index()
    {
        $roles = Role::with([
            'permissions' => function ($query) {
                $query->orderBy('name');
            }
        ])->paginate(15);
        $permissions = Permission::orderBy('name', 'asc')->get();

        return Inertia::render('Admin/Roles/Index', [
            'roles' => RolesResource::collection($roles),
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'permission_name' => 'required|array',
        ]);

        $role = Role::create(['name' => $validated['name']]);

        $permissions = array_unique(array_merge($validated['permission_name'], ['allow.always']));
        $role->syncPermissions($permissions);

        return redirect()->back()->with('success', 'Role is Created Successfully');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'permission_name' => 'required|array',
        ]);

        $role = Role::findOrFail($id);
        $role->update(['name' => $validated['name']]);
        $role->syncPermissions($validated['permission_name']);

        return redirect()->back()->with('success', 'Role is Updated Successfully');
    }

    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return redirect()->back()->with('info', 'Role is Deleted Successfully');
    }
}
