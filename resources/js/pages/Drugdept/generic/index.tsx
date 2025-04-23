// pages/Wards/Index.jsx
import React, { useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import AppLayout from '@/layouts/app-layout';
import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { type BreadcrumbItem } from '@/types';
import CreateWardDialog from './CreateWardDialog';
import EditWardDialog from './EditWardDialog';
import DeleteDialog from './DeleteGenericDialog';
import GenericStatusBadge from './GenericStatusBadge'
import { PaginationProps } from '@/components/table/pagination'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Generic', href: '/generics' },
];

interface Ward {
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
    data: Ward[];
    pagination: PaginationProps;
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
      accessorKey: 'status',
      header: ({ column }) => <ColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <GenericStatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: ({ column }) => <ColumnHeader column={column} title="Actions" />,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <EditWardDialog ward={row.original} />
          <DeleteDialog generic={row.original} />
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

        <div className="rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <DataTable
              data={data.data}
              columns={columns}
              search_route={route('generics.index')}
              // pagination={data.pagination}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WardIndex;
