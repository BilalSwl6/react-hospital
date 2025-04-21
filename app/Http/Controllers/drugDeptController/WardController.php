<?php

namespace App\Http\Controllers\drugDeptController;

use App\Models\Ward;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Http\Resources\Drugdept\WardResource;

class WardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wards = Ward::paginate(10);
        return Inertia::render('Drugdept/ward/index', [
            'data' => WardResource::collection($wards),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('drugDept.ward.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'ward_name' => 'required|string|max:255',
            'ward_description' => 'required|string',
            'ward_capacity' => 'numeric|nullable',
            'ward_status' => 'nullable',
        ]);

        Ward::create([
            'ward_name' => $request->ward_name,
            'ward_description' => $request->ward_description,
            'ward_capacity' => $request->ward_capacity,
            'ward_status' => $request->ward_status == true ? 1 : 0,
        ]);

        return redirect('/wards')->with('success', 'Ward created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ward $ward)
    {
        return view('drugDept.ward.show', compact('ward'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ward $ward)
    {
        return view('drugDept.ward.edit', compact('ward'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ward $ward)
    {
        $request->validate([
            'ward_name' => 'required|string|max:255',
            'ward_description' => 'required|string',
            'ward_capacity' => 'numeric|nullable',
            'ward_status' => 'nullable',
        ]);

        $ward->update([
            'ward_name' => $request->ward_name,
            'ward_description' => $request->ward_description,
            'ward_capacity' => $request->ward_capacity,
            'ward_status' => $request->ward_status == true ? 1 : 0,
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
                    'text' => $ward->ward_name
                ];
            }),
            'total_count' => $wards->total()
        ]);
    }
}
