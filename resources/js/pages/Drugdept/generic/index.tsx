import { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import AppLayout from '@/layouts/app-layout';
import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { type BreadcrumbItem } from '@/types';
import CreateGenericDialog from './CreateGenericDialog';
import EditGenericDialog from './EditGenericDialog';
import DeleteDialog from './DeleteGenericDialog';
import GenericStatusBadge from './GenericStatusBadge';
import { PaginationProps } from '@/components/table/pagination';
import { CircleHelp } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Generic', href: '/generics' },
];

interface Generic {
    id: number;
    name: string;
    description: string;
    category: string;
    sub_category: string;
    therapeutic_class: string;
    notes: string;
    status: number;
}

interface PageProps {
    data: {
        data: Generic[];
        meta: PaginationProps;
    };
}

const GenericIndex = ({ data }: PageProps) => {
    const columns = useMemo<ColumnDef<Generic>[]>(() => [
        {
            accessorKey: 'name',
            header: ({ column }) => <ColumnHeader column={column} title="Generic Name" />,
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
            id: 'category_subcategory',
            header: ({ column }) => <ColumnHeader column={column} title="Category and Sub Category" />,
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {row.original.category} / {row.original.sub_category}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <ColumnHeader column={column} title="Status" />,
            cell: ({ row }) => <GenericStatusBadge status={row.original.status} />,
        },
        {
            id: 'actions',
            header: ({ column }) => <ColumnHeader column={column} title="Actions" />,
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <EditGenericDialog generic={row.original} />
                    <DeleteDialog generic={row.original} />
                </div>
            ),
        },
    ], []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Generics" />
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Generics Management</h1>
                    <CreateGenericDialog />
                </div>
                <form
                    className="w-full sm:w-auto mb-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const value = (e.target as HTMLFormElement).elements.namedItem('search') as HTMLInputElement;
                        router.get(route('generics.index'), {
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
                            search_route={route('generics.index')}
                            pagination={data.meta}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default GenericIndex;
