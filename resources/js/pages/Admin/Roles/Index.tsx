import Modal from '@/components/model';
import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { type PaginationProps } from '@/components/table/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import UserForm from './Form';

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: {
        id: number;
        name: string;
    }[];
    permission_name?: string[];
}

interface PageProps {
    roles: {
        meta: PaginationProps;
        data: Role[];
    };
    permissions: {
        id: number;
        name: string;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Roles', href: '/roles' },
];

export default function RolesPage({ roles, permissions }: PageProps) {
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);

    const handleDelete = (role: Role) => {
        if (!confirm('Are you sure you want to delete this Role?')) return;

        setDeletingRoleId(role.id);

        router.delete(route('roles.destroy', role.id), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setSelectedRole(null);
                setDeletingRoleId(null);
            },
        });
    };

    const handleEdit = (role: Role) => {
        const permissionNames = role.permissions.map((p) => p.name);
        setSelectedRole({ ...role, permission_name: permissionNames });
        setOpen(true);
    };

    const handleCreate = () => {
        setSelectedRole(null);
        setOpen(true);
    };

    const columns = useMemo<ColumnDef<Role>[]>(
        () => [
            {
                accessorKey: 'name',
                header: ({ column }) => <ColumnHeader column={column} title="Role Name" />,
                cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
            },
            {
                accessorKey: 'guard_name',
                header: ({ column }) => <ColumnHeader column={column} title="Guard Name" />,
                cell: ({ row }) => <div className="font-medium">{row.original.guard_name}</div>,
            },
            {
                accessorKey: 'permissions',
                header: ({ column }) => <ColumnHeader column={column} title="Permissions" />,
                cell: ({ row }) => {
                  const grouped = row.original.permissions.reduce((acc: Record<string, string[]>, perm) => {
                    const [group, action] = perm.name.split('.');
                    if (!acc[group]) acc[group] = [];
                    acc[group].push(action);
                    return acc;
                  }, {});
              
                  return (
                    <div className="flex flex-wrap items-center gap-2">
                      {Object.entries(grouped).map(([group, actions]) => (
                        <div key={group} className="flex items-center gap-1 flex-nowrap">
                          <span className="text-muted-foreground text-xs font-semibold capitalize">{group}:</span>
                          <div className="flex flex-wrap gap-1">
                            {actions.map((action, index) => {
                              const fullPermission = `${group}.${action}`;
                              return (
                                <Tooltip key={index}>
                                  <TooltipTrigger asChild>
                                    <Badge variant="secondary">{action}</Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>{fullPermission}</TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                },
              },              
            {
                id: 'actions',
                header: ({ column }) => <ColumnHeader column={column} title="Actions" />,
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        {can('role.edit') && (
                            <Button variant="secondary" onClick={() => handleEdit(row.original)}>
                                Edit
                            </Button>
                        )}
                        {can('role.delete') && (
                            <Button variant="destructive" onClick={() => handleDelete(row.original)} disabled={deletingRoleId === row.original.id}>
                                {deletingRoleId === row.original.id ? 'Removing...' : 'Remove'}
                            </Button>
                        )}
                    </div>
                ),
            },
        ],
        [deletingRoleId],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <Button onClick={handleCreate}>Create</Button>
                    {can('role.view') && (
                        <DataTable data={roles.data} columns={columns} pagination={roles.meta} searchable search_route={route('roles.index')} />
                    )}
                </div>
            </div>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title={selectedRole ? 'Edit Role' : 'Create Role'}
                description={selectedRole ? 'Update the role information below.' : 'Fill the form to create a new role.'}
                size="lg"
                confirmBeforeClose={false}
            >
                <UserForm onClose={() => setOpen(false)} {...(selectedRole && { role: selectedRole })} permission={permissions} />
            </Modal>
        </AppLayout>
    );
}
