import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permission_name?: string[];
}

interface UserFormProps {
    role?: Role;
    permission: Permission[];
    onClose: () => void;
}

export default function UserForm({ role, permission, onClose }: UserFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
        permission_name: role?.permission_name ?? [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (role) {
            put(route('roles.update', role.id), {
                ...data,
                preserveScroll: true,
                preserveState: true,
                onSuccess: onClose,
            });
        } else {
            post(route('roles.store'), {
                ...data,
                preserveScroll: true,
                preserveState: true,
                onSuccess: onClose,
            });
        }
    };

    const togglePermission = (permName: string) => {
        const updated = data.permission_name.includes(permName)
            ? data.permission_name.filter((name) => name !== permName)
            : [...data.permission_name, permName];
        setData('permission_name', updated);
    };

    return (
        <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-6 overflow-y-auto pr-2">
            <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Role name" />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label>Permissions</Label>
                {Object.entries(
                    (permission || []).reduce(
                        (acc, perm) => {
                            const [section, action] = perm.name.split('.');
                            if (!section || !action) return acc;

                            acc[section] = acc[section] || [];
                            acc[section].push(perm);
                            return acc;
                        },
                        {} as Record<string, Permission[]>,
                    ),
                )
                    .sort(([a], [b]) => a.localeCompare(b)) // sort sections
                    .map(([section, perms]) => (
                        <div key={section} className="mb-4 rounded-md border p-3">
                            <h4 className="mb-2 font-medium capitalize">{section}</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {perms
                                    .sort((a, b) => {
                                        const actionA = a.name.split('.')[1];
                                        const actionB = b.name.split('.')[1];
                                        return actionA.localeCompare(actionB);
                                    })
                                    .map((perm) => (
                                        <div key={perm.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`perm-${perm.id}`}
                                                checked={data.permission_name.includes(perm.name)}
                                                onCheckedChange={() => togglePermission(perm.name)}
                                            />
                                            <Label htmlFor={`perm-${perm.id}`} className="capitalize">
                                                {perm.name.split('.')[1]}
                                            </Label>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}

                <InputError message={errors.permission_name} />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" onClick={onClose} variant="outline">
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : role ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
}
