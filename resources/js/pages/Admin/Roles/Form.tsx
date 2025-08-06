import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface UserFormProps {
    role?: { id: number; name: string };
    permission: { id: number; name: string }[];
    onClose: () => void;
}

export default function UserForm({ role, permission, onClose }: UserFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
        permission_id: '',
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Name" />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-1">
                <Label>Permission</Label>
                <RadioGroup value={data.permission_id} onValueChange={(value) => setData('permission_id', value)}>
                    {permission.map((perm) => (
                        <div key={perm.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={String(perm.id)} id={`perm-${perm.id}`} />
                            <Label htmlFor={`perm-${perm.id}`}>{perm.name}</Label>
                        </div>
                    ))}
                </RadioGroup>
                <InputError message={errors.permission_id} />
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
