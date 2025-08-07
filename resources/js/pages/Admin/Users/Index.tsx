import Modal from '@/components/model';
import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { type PaginationProps } from '@/components/table/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import UserForm from './Form';

interface User {
    id: number;
    name: string;
    email: string;
    role: {
        name: string;
    }[];
    password?: string;
}

interface PageProps {
    users: {
        meta: PaginationProps;
        data: User[];
    };
    roles: {
        id: number;
        name: string;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Users', href: '/users' },
];

export default function Dashboard({ users, roles }: PageProps) {
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

    const handleDelete = (user: User) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        setSelectedUser(user);

        router.delete(route('users.destroy', user.id), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setSelectedUser(null),
        });
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setOpen(true);
    };

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'name',
                header: ({ column }) => <ColumnHeader column={column} title="User Name" />,
                cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
            },
            {
                accessorKey: 'email',
                header: ({ column }) => <ColumnHeader column={column} title="Email" />,
                cell: ({ row }) => <div className="font-medium">{row.original.email}</div>,
            },
            {
                accessorKey: 'role',
                header: ({ column }) => <ColumnHeader column={column} title="Role" />,
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-1">
                        {row.original.role.map((role, i) => (
                            <Badge key={i} variant="outline" className="text-xs capitalize">
                                {role.name}
                            </Badge>
                        ))}
                    </div>
                ),
            },
            {
                id: 'actions',
                header: ({ column }) => <ColumnHeader column={column} title="Actions" />,
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        {can('user.edit') && (
                            <Button variant="secondary" onClick={() => handleEdit(row.original)}>
                                Edit
                            </Button>
                        )}
                        {can('user.delete') && (
                            <Button variant="destructive" onClick={() => handleDelete(row.original)} disabled={deletingUserId === row.original.id}>
                                {deletingUserId === row.original.id ? 'Removing...' : 'Remove'}
                            </Button>
                        )}
                    </div>
                ),
            },
        ],
        [selectedUser],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    {can('user.create') && <Button onClick={handleCreate}>Create</Button>}
                    {can('user.view') && (
                        <DataTable data={users.data} columns={columns} pagination={users.meta} searchable search_route={route('users.index')} />
                    )}
                </div>
            </div>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title={selectedUser ? 'Edit User' : 'Create User'}
                description={selectedUser ? 'Update the user information below.' : 'Fill the form to create a new user.'}
                size="lg"
                confirmBeforeClose={false}
            >
                <UserForm
                    //   user={selectedUser}
                    onClose={() => setOpen(false)}
                    roles={roles}
                    {...(selectedUser && { user: selectedUser })}
                />
            </Modal>
        </AppLayout>
    );
}
