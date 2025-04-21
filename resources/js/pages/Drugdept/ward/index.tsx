import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ward', href: '/wards' },
];

interface Wards {
    id: number;
    name: string;
    description: string;
    capacity: number;
    status: string;
}

interface PageProps {
    data: {
        data: Wards[];
    };
}

export default function Ward({ data }: PageProps) {
    const columns = useMemo<ColumnDef<Wards>[]>(() => [
        {
            accessorKey: 'name',
            header: ({ column }) => <ColumnHeader column={column} title="Ward Name" />,
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground" title={row.original.name}>
                    {row.original.name}
                </span>
            ),
        },
        {
            accessorKey: 'description',
            header: ({ column }) => <ColumnHeader column={column} title="Description" />,
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground" title={row.original.description}>
                    {row.original.description}
                </span>
            ),
        },
        {
            accessorKey: 'capacity',
            header: ({ column }) => <ColumnHeader column={column} title="Capacity" />,
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">{row.original.capacity}</span>
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <ColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const status = row.original.status;
                const color = status === 'active' ? 'text-green-600' : 'text-red-600';
                return (
                    <span className={`text-sm font-semibold ${color}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: ({ column }) => <ColumnHeader column={column} title="Actions" />,
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('Edit', row.original.id)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => console.log('Delete', row.original.id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ], []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Wards" />
            <div className="rounded-lg border bg-white shadow-sm">
                <div className="overflow-x-auto rounded-t-lg">
                    <DataTable data={data.data} columns={columns} button={
                        <>
                                                <Button variant="link" className="m-4">
                            Add Ward
                            </Button>
                        </>
                    } />
                </div>
            </div>
        </AppLayout>
    );
}
