import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    Table as TanstackTable,
    useReactTable,
} from '@tanstack/react-table';
import React from 'react';

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
};

function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
    className,
    button
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className={`w-full ${className || ""}`}>
            {/* Conditionally render button if provided */}
            {button && (
                <div className="mb-4 flex items-center justify-between">
                    {button}
                </div>
            )}
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

            {/* Conditionally show pagination with proper spacing */}
            {pagination && (
                <div className="mt-4">
                    <Pagination table={table as TanstackTable<TData>} pagination={pagination} />
                </div>
            )}
        </div>
    );
}

export default DataTable;
