import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { PaginationProps } from '@/components/table/pagination';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CircleHelp } from 'lucide-react';
import { useMemo } from 'react';
import CreateGenericDialog from './CreateGenericDialog';
import DeleteDialog from './DeleteGenericDialog';
import EditGenericDialog from './EditGenericDialog';
import GenericStatusBadge from './GenericStatusBadge';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Generic', href: '/generics' }];

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
    const columns = useMemo<ColumnDef<Generic>[]>(
        () => [
            {
                accessorKey: 'name',
                header: ({ column }) => <ColumnHeader column={column} title="Generic Name" />,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <div className="text-muted-foreground text-sm">{row.original.name}</div>
                        {row.original.notes && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <CircleHelp className="text-muted-foreground h-4 w-4" />
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
                    const truncatedDescription = isLongDescription ? `${description.substring(0, 30)}...` : description;

                    return (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-muted-foreground max-w-xs cursor-help truncate text-sm">{truncatedDescription}</div>
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
                    <div className="text-muted-foreground text-sm">
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
                        {can('generic.edit') && <EditGenericDialog generic={row.original} />}
                        {can('generic.delete') && <DeleteDialog generic={row.original} />}
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Generics" />
            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Generics Management</h1>
                    {can('generic.create') && <CreateGenericDialog />}
                </div>
                <form
                    className="mb-4 w-full sm:w-auto"
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
                    <Input type="text" id="search" name="search" placeholder="Search..." className="w-full sm:w-auto" />
                </form>

                <div className="rounded-lg border shadow-sm">
                    <div className="overflow-x-auto">
                        {can('generic.view') && (
                            <DataTable data={data.data} columns={columns} search_route={route('generics.index')} pagination={data.meta} />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default GenericIndex;
