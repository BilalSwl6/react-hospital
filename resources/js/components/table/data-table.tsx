import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    //getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    Table as TanstackTable,
    useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

import Pagination from '@/components/table/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Type for Laravel-style pagination
type PaginationType = {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    path: string;
};

// Props for the DataTable component
type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: PaginationType;
    className?: string;
    button?: React.ReactNode;
    searchable?: boolean;
    search_placeholder?: string;
    search_value?: string;
    search_column?: string; // Which column to search in
    onSearch?: (value: string) => void;
    search_route?: string; // Optional now since we support both client and server-side search
    searchDebounceMs?: number; // Debounce time for search input
};

function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
    className,
    button,
    searchable = false,
    search_placeholder = "Search...",
    search_value: initialSearchValue = "",
    search_column = "name", // Default column to search
    onSearch,
    // search_route,
    searchDebounceMs = 300,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [searchInput, setSearchInput] = useState(initialSearchValue);

    // Set up debounced search
    useEffect(() => {
        if (!searchable) return;

        const timer = setTimeout(() => {
            // If onSearch is provided, use it (likely for server-side search)
            if (onSearch) {
                onSearch(searchInput);
            }
            // Otherwise use client-side filtering
            else if (search_column) {
                setColumnFilters([
                    {
                        id: search_column,
                        value: searchInput,
                    },
                ]);
            }
        }, searchDebounceMs);

        return () => clearTimeout(timer);
    }, [searchInput, onSearch, search_column, searchable, searchDebounceMs]);

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        // will be used for server-side pagination
        //getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        state: {
            sorting,
            columnFilters,
        },
    });

    // Handler for search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    return (
        <div className={`w-full p-2 ${className || ""}`}>
            {/* Search input rendering with better styling */}
            {searchable && (
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative w-72">
                        <input
                            type="text"
                            placeholder={search_placeholder}
                            value={searchInput}
                            onChange={handleSearchChange}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {searchInput && (
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() => setSearchInput("")}
                                aria-label="Clear search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                    {button && <div>{button}</div>}
                </div>
            )}

            {/* Button-only row when search is disabled but button exists */}
            {!searchable && button && (
                <div className="mb-4 flex items-center justify-between">
                    {button}
                </div>
            )}

            {/* Advance option */}

            {/* Table component */}
            <div className="overflow-hidden rounded-md border border-border shadow-sm">
                <Table className="w-full">
                    <TableHeader className="bg-muted/50 dark:bg-muted/20">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-muted/20 dark:hover:bg-muted/10">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="font-medium text-secondary-foreground h-12"
                                    >
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() ? 'selected' : undefined}
                                    className="border-b border-border last:border-0 transition-colors hover:bg-muted/50 dark:hover:bg-muted/10"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    No Results
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="mt-4">
                    <Pagination table={table as TanstackTable<TData>} pagination={pagination} />
                </div>
            )}
        </div>
    );
}

export default DataTable;
