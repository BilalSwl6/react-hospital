import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { PaginationProps } from '@/components/table/pagination';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import CreateWardDialog from './CreateWardDialog';
import DeleteWardDialog from './DeleteWardDialog';
import EditWardDialog from './EditWardDialog';
import WardStatusBadge from './WardStatusBadge';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Wards', href: '/wards' }];

interface Ward {
    id: number;
    name: string;
    description: string;
    capacity: number;
    status: number;
}

interface PageProps {
    data: {
        data: Ward[];
        meta: PaginationProps;
    };
}

const WardIndex = ({ data }: PageProps) => {
    const columns = useMemo<ColumnDef<Ward>[]>(
        () => [
            {
                accessorKey: 'name',
                header: ({ column }) => <ColumnHeader column={column} title="Ward Name" />,
                cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
            },
            {
                accessorKey: 'description',
                header: ({ column }) => <ColumnHeader column={column} title="Description" />,
                cell: ({ row }) => (
                    <div className="text-muted-foreground max-w-xs truncate text-sm" title={row.original.description}>
                        {row.original.description}
                    </div>
                ),
            },
            {
                accessorKey: 'capacity',
                header: ({ column }) => <ColumnHeader column={column} title="Capacity" />,
                cell: ({ row }) => {
                    const capacity = row.original.capacity;
                    const capacityText = capacity > 0 ? `${capacity} beds` : 'No capacity/Not set';
                    return <div className="text-sm">{capacityText}</div>;
                },
            },
            {
                accessorKey: 'status',
                header: ({ column }) => <ColumnHeader column={column} title="Status" />,
                cell: ({ row }) => <WardStatusBadge status={row.original.status} />,
            },
            {
                id: 'actions',
                header: ({ column }) => <ColumnHeader column={column} title="Actions" />,
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        {can('ward.edit') && <EditWardDialog ward={row.original} />}
                        {can('ward.delete') && <DeleteWardDialog ward={row.original} />}
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Wards" />
            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Wards Management</h1>
                    {can('ward.create') && <CreateWardDialog />}
                </div>

                <div className="rounded-lg shadow-sm">
                    <div className="overflow-x-auto">
                        {can('ward.view') && (
                            <DataTable data={data.data} columns={columns} pagination={data.meta} searchable search_route={route('wards.index')} />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default WardIndex;
