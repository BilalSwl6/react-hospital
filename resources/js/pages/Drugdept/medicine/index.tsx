import { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import AppLayout from '@/layouts/app-layout';
import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { type BreadcrumbItem } from '@/types';
import CreateMedicineDialog from './CreateMedicineDialog';
import EditMedicineDialog from './EditMedicineDialog';
import DeleteDialog from './DeleteMedicineDialog';
import MedicineStatusBadge from './MedicineStatusBadge';
import StockDialog from './StockDialog';
import { PaginationProps } from '@/components/table/pagination';
import { CircleHelp, EllipsisVertical } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ViewLogDialog from './ViewLogDialog';
import ViewMedicineDialog from './ViewMedicineDialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';



const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Total Items / Medicine', href: '/medicines' },
];

export interface Medicine {
    id: number;
    name: string;
    description: string;
    generic_id: string | [];
    generic_name: string;
    quantity: number;
    total_quantity: number;
    price: number;
    batch_no: string;
    dosage: string;
    strength: string;
    route: string;
    notes: string;
    expiry_date: string;
    category: string;
    manufacturer: string;
    status: string;
    image: string;
}

export interface Generic {
    data: {
        id: string;
        name: string;
    }[];
}

interface PageProps {
    data: {
        data: Medicine[];
        meta: PaginationProps;
    };
    generics: Generic;
}

const MedicineIndex = ({ data, generics }: PageProps) => {

    const [Open, setOpen] = useState(false);

    const columns = useMemo<ColumnDef<Medicine>[]>(() => [
        {
            accessorKey: 'name',
            header: ({ column }) => <ColumnHeader column={column} title="Item Name" />,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">{row.original.name}</div>
                    {row.original.notes && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleHelp className="w-4 h-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{row.original.notes}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            ),
        },
        {
            id: 'generic_name',
            accessorKey: 'generic_name',
            header: ({ column }) => <ColumnHeader column={column} title="Generic Name" />,
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">{row.original.generic_name}</div>
            ),
        },
        {
            accessorKey: 'description',
            enableSorting: false,
            header: ({ column }) => <ColumnHeader column={column} title="Description" />,
            cell: ({ row }) => {
                const description = row.original.description || 'No description available';
                const isLongDescription = description.length > 30;
                const truncatedDescription = isLongDescription
                    ? `${description.substring(0, 30)}...`
                    : description;

                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="max-w-xs truncate text-sm text-muted-foreground cursor-help">
                                    {truncatedDescription}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{description}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
        },
        {
            id: 'quantity',
            accessorKey: 'quantity',
            enableSorting: false,
            header: ({ column }) => <ColumnHeader column={column} title="Quantity" />,
            cell: ({ row }) => {
                const quantity = row.original.quantity || 0;
                const totalQuantity = row.original.total_quantity || 0;
                const isLowStock = quantity < totalQuantity * 0.2;
                const zeroQuantity = quantity <= 0;
                return (
                    <div className={`text-sm ${isLowStock ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {zeroQuantity ? (
                            <span className="text-red-500">Out of Stock</span>
                        ) : (
                                <span>{quantity}</span>
                            )}
                    </div>
                );
            }
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <ColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const { status, expiry_date: rawExpiry, quantity } = row.original;

                // Handle different timestamp formats
                let expiryMs: number;

                if (rawExpiry) {
                    // Handle string timestamps
                    if (typeof rawExpiry === 'string') {
                        expiryMs = new Date(rawExpiry).getTime();
                    }
                    // Handle numeric timestamps (seconds or milliseconds)
                    else if (typeof rawExpiry === 'number') {
                        expiryMs = rawExpiry < 1e12 ? rawExpiry * 1000 : rawExpiry;
                    }
                    // Default fallback
                    else {
                        expiryMs = 0;
                    }
                } else {
                    // If expiry date is null/undefined/falsy
                    expiryMs = 0;
                }

                const nowMs = Date.now();
                const isExpired = expiryMs > 0 && expiryMs <= nowMs;
                const isLowStock = typeof quantity === 'number' && quantity <= 15;

                return (
                    <MedicineStatusBadge
                        status={status}
                        isExpired={isExpired}
                        isLowStock={isLowStock}
                    />
                );
            },
        },
        {
            id: 'actions',
            header: ({ column }) => <ColumnHeader column={column} title="Actions" />,
            cell: ({ row }) => (
                <div className="flex items-center space-x-3">
                    {/* Stock dialog with right margin  */}
                    <StockDialog medicine={row.original} className="p-1" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="p-2 cursor-pointer rounded hover:bg-gray-100">
                                <EllipsisVertical className="w-4 h-4" />
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="p-2 space-y-1">
                            <DropdownMenuItem
                                className="px-3 py-2 rounded hover:bg-gray-100"
                                onSelect={(e) => e.preventDefault()}
                            >
                                <EditMedicineDialog
                                    medicine={row.original}
                                    generic={generics}
                                    onOpenChange={setOpen}
                                />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="px-3 py-2 rounded hover:bg-gray-100"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setOpen(true);
                                }}
                            >
                                <ViewLogDialog
                                    medicineId={row.original.id}
                                    medicineName={row.original.name}
                                />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="px-3 py-2 rounded hover:bg-gray-100"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setOpen(true);
                                }}
                            >
                                <DeleteDialog medicine={row.original} />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="px-3 py-2 rounded hover:bg-gray-100"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setOpen(true);
                                }}
                            >
                                <ViewMedicineDialog medicine={row.original} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ], []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Medicine & Surgical Items" />
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Medicines Management</h1>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <CreateMedicineDialog generic={generics} />
                        <div className="w-full sm:w-auto">
                            <a href={route('medicines.export')} target="_blank">
                                <Button variant="secondary" className="w-full sm:w-auto">
                                    Export Data
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
                <form
                    className="w-full sm:w-auto mb-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const value = (e.target as HTMLFormElement).elements.namedItem('search') as HTMLInputElement;
                        router.get(route('medicines.index'), {
                            search: value.value,
                        });
                    }}
                >
                    <Label htmlFor="search" className="sr-only">
                        Search
                    </Label>
                    <Input
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Search..."
                        className="w-full sm:w-auto"
                    />
                </form>

                <div className="rounded-lg border shadow-sm">
                    <div className="overflow-x-auto">
                        <DataTable
                            data={data.data}
                            columns={columns}
                            search_route={route('medicines.index')}
                            pagination={data.meta}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default MedicineIndex;
