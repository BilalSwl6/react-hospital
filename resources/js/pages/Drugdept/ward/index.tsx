import { useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import AppLayout from '@/layouts/app-layout';
import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { type BreadcrumbItem } from '@/types';
import CreateWardDialog from './CreateWardDialog';
import EditWardDialog from './EditWardDialog';
import DeleteWardDialog from './DeleteWardDialog';
import WardStatusBadge from './WardStatusBadge';
import { PaginationProps } from '@/components/table/pagination'
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Wards', href: '/wards' },
];

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

  const columns = useMemo<ColumnDef<Ward>[]>(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => <ColumnHeader column={column} title="Ward Name" />,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => <ColumnHeader column={column} title="Description" />,
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground" title={row.original.description}>
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
        return (
          <div className="text-sm">{capacityText}</div>
        );
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
          <EditWardDialog ward={row.original} />
          <DeleteWardDialog ward={row.original} />
        </div>
      ),
    },
  ], []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Wards" />
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Wards Management</h1>
          <CreateWardDialog />
        </div>

        <div className="rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <DataTable
              data={data.data}
              columns={columns}
              pagination={data.meta}
              searchable
              search_route={route('wards.index')}
              button={
                <>
                <Button>Click me</Button>
                </>
              }
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WardIndex;
