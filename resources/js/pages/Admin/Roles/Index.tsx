import Modal from '@/components/model';
import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { type PaginationProps } from '@/components/table/pagination';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import UserForm from './Form';

interface Role {
    id: number;
    name: string;
    guard_name: string;
}

interface PageProps {
    roles: {
        meta: PaginationProps;
        data: Role[];
    };
    permission: {
        id: number;
        name: string;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Roles', href: '/roles' },
];

export default function Dashboard({ roles, permission }: PageProps) {
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);

    console.log(permission);
    const handleDelete = (role: Role) => {
        if (!confirm('Are you sure you want to delete this Role?')) return;

        setSelectedRole(role);
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
        setSelectedRole(role);
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
                id: 'actions',
                header: ({ column }) => <ColumnHeader column={column} title="Actions" />,
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => handleEdit(row.original)}>
                            Edit
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(row.original)} disabled={deletingRoleId === row.original.id}>
                            {deletingRoleId === row.original.id ? 'Removing...' : 'Remove'}
                        </Button>
                    </div>
                ),
            },
        ],
        [selectedRole],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <Button onClick={handleCreate}>Create</Button>
                    <DataTable data={roles.data} columns={columns} pagination={roles.meta} searchable search_route={route('roles.index')} />
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
                <UserForm
                    //   user={selectedUser}
                    onClose={() => setOpen(false)}
                    {...(selectedRole && { role: selectedRole })}
                    permission={permission}
                />
            </Modal>
        </AppLayout>
    );
}
