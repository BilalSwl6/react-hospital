<?php

namespace App\Http\Controllers\drugDeptController;

use App\Http\Controllers\Controller;
use App\Http\Resources\Drugdept\WardResource;
use App\Models\Ward;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wards = Ward::all();
        /* $wards = Ward::paginate(10); */

        return Inertia::render('Drugdept/ward/index', [
            'data' => WardResource::collection($wards),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'numeric|nullable',
            'status' => 'nullable',
        ]);

        Ward::create([
            'ward_name' => $request->name,
            'ward_description' => $request->description,
            'ward_capacity' => $request->capacity,
            'ward_status' => $request->status == true ? 1 : 0,
        ]);

        return redirect()->back()->with('success', 'Ward created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ward $ward)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'numeric|nullable',
            'status' => 'nullable',
        ]);

        $ward->update([
            'ward_name' => $request->name,
            'ward_description' => $request->description,
            'ward_capacity' => $request->capacity,
            'ward_status' => $request->status == true ? 1 : 0,
        ]);

        return redirect('/wards')->with('success', 'Ward updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ward $ward)
    {
        $ward->delete();

        return redirect('/wards')->with('info', 'Ward deleted successfully.');
    }

    public function search(Request $request)
    {
        $search = $request->get('q');
        $query = Ward::query();

        if ($search) {
            $query->where('ward_name', 'LIKE', "%{$search}%");
        }

        $wards = $query->paginate(30);

        return response()->json([
            'items' => $wards->map(function ($ward) {
                return [
                    'id' => $ward->id,
                    'text' => $ward->ward_name,
                ];
            }),
            'total_count' => $wards->total(),
        ]);
    }
}
