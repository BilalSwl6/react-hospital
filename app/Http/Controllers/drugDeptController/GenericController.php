<?php

namespace App\Http\Controllers\drugDeptController;

use App\Http\Controllers\Controller;
use App\Models\Generic;
use Illuminate\Http\Request;
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

        return Inertia::render('Drugdept/generic/index')->with('data', $generics);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'generic_name' => 'required',
            'generic_description' => 'nullable',
            'therapeutic_class' => 'required|string|max:255',
            'generic_category' => 'nullable|string|max:255',
            'generic_subcategory' => 'nullable',
            'generic_notes' => 'nullable|string',
            'generic_status' => 'nullable',
        ]);

        Generic::create([
            'generic_name' => $request->generic_name,
            'generic_description' => $request->generic_description,
            'therapeutic_class' => $request->therapeutic_class,
            'generic_category' => $request->generic_category,
            'generic_subcategory' => $request->generic_subcategory,
            'generic_notes' => $request->generic_notes,
            'generic_status' => $request->generic_status == true ? 1 : 0,
        ]);

        return redirect('/generics')->with('success', 'Generic created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Generic $generic)
    {
        $request->validate([
            'generic_name' => 'required',
            'generic_description' => 'nullable',
            'therapeutic_class' => 'required|string|max:255',
            'generic_category' => 'nullable|string|max:255',
            'generic_subcategory' => 'nullable',
            'generic_notes' => 'nullable|string',
            'generic_status' => 'nullable',
        ]);
        $generic->update([
            'generic_name' => $request->generic_name,
            'generic_description' => $request->generic_description,
            'therapeutic_class' => $request->therapeutic_class,
            'generic_category' => $request->generic_category,
            'generic_subcategory' => $request->generic_subcategory,
            'generic_notes' => $request->generic_notes,
            'generic_status' => $request->generic_status == true ? 1 : 0,
        ]);

        return redirect('/generics')->with('success', 'Generic updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Generic $generic)
    {
        $generic->delete();

        return redirect('/generics')->with('info', 'Generic deleted successfully.');
    }
}
