<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\Roles\RolesResource;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class ManageRoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::paginate(15);
        $permission = Permission::all();
        return Inertia::render("Admin/Roles/Index", [
            "roles"=> RolesResource::collection($roles),
            "permission"=> $permission,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validared = $request->validate([
            "name"=> "string|required"
        ]);

        $role = Role::create($validared);

        return redirect()->back()->with("success","Role is Created Successfully");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            "name"=> "string|required"
        ]);

        $role = Role::findOrFail($id);
        $role->update($validated);
        $role->save();

        return redirect()->back()->with("success","Role is Updated Successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return redirect()->back()->with("info","Role is Deleted Successfully");
    }
}
