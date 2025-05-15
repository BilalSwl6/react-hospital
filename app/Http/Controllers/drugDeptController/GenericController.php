<?php

namespace App\Http\Controllers\drugDeptController;

use App\Http\Controllers\Controller;
use App\Models\Generic;
use Illuminate\Http\Request;
use App\Http\Resources\Drugdept\Generic\GenericResource;
use Inertia\Inertia;

class GenericController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // add search functionality
        $query = Generic::query();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('generic_name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('therapeutic_class', 'LIKE', "%{$searchTerm}%");
            });
        }

        $generics = $query->orderBy('generic_name')->paginate(25);

        return Inertia::render('Drugdept/generic/index', [
            'data' => GenericResource::collection($generics),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'nullable',
            'therapeutic_class' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'sub_category' => 'nullable',
            'notes' => 'nullable|string',
            'status' => 'nullable',
        ]);

        Generic::create([
            'generic_name' => $request->name,
            'generic_description' => $request->description,
            'therapeutic_class' => $request->therapeutic_class,
            'generic_category' => $request->category,
            'generic_subcategory' => $request->sub_category,
            'generic_notes' => $request->notes,
            'generic_status' => $request->status == true ? 1 : 0,
        ]);

        return redirect()->back()->with('success', 'Generic created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Generic $generic)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'nullable',
            'therapeutic_class' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'sub_category' => 'nullable',
            'notes' => 'nullable|string',
            'status' => 'nullable',
        ]);
        $generic->update([
            'generic_name' => $request->name,
            'generic_description' => $request->description,
            'therapeutic_class' => $request->therapeutic_class,
            'generic_category' => $request->category,
            'generic_subcategory' => $request->sub_category,
            'generic_notes' => $request->notes,
            'generic_status' => $request->status == true ? 1 : 0,
        ]);

        return redirect()->back()->with('success', 'Generic updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Generic $generic)
    {
        if ($generic->medicines()->exists()) {
            return redirect()->back()->with('error', 'Generic cannot be deleted because it has associated medicines.');
        }

        $generic->delete();
        return redirect()->back()->with('info', 'Generic deleted successfully.');
    }
}
