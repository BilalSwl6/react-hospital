import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ward',
        href: '/wards',
    },
];

interface PageProps extends Record<string, any> {
    status?: string;
    error?: string;
    success?: string;
    data?: any;
}

interface Wards {
    id: number;
    name: string;
    description: string;
    status: string;
}

export default function Ward({ status, error, success, data }: PageProps) {

    console.log(data)

    const columns = useMemo<ColumnDef<Wards>[]>(
        () => [
            {
                id: 'name',
                accessorKey: 'name',
                header: ({ column }) => <ColumnHeader column={column} title="Ward Name" />,
                disableSortBy: false,
                cell: ({ row }) => {
                    const name = row.original.name
                    return (
                        <>
                        <div className="text-muted-foreground max-w-md text-sm" title={name}>{name}</div>
                        </>
                    );
                }
            },
        ],
        [],
    );
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Wards" />
                <div className="rounded-lg border">
                    <div className="overflow-x-auto rounded-t-lg">
                        <DataTable data={data.data} columns={columns} pagination={data} />
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
