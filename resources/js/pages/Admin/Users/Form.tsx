import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface UserFormProps {
    user?: {
        id: number;
        name: string;
        email: string;
        role?: { name: string }[];
    };
    onClose: () => void;
    roles: { id: number; name: string }[];
}

export default function UserForm({ user, onClose, roles }: UserFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role?.map((r) => r.name) || [],
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            put(route('users.update', user.id), {
                ...data,
                preserveScroll: true,
                onSuccess: onClose,
            });
        } else {
            post(route('users.store'), {
                ...data,
                preserveScroll: true,
                onSuccess: onClose,
            });
        }
    };

    console.log('roles', roles);
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                <InputError message={errors.email} />
            </div>

            <div className="space-y-1">
                <Label htmlFor="password">
                    Password {user && <span className="text-muted-foreground text-sm">(leave blank to keep current)</span>}
                </Label>
                <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                <InputError message={errors.password} />
            </div>

            <div className="space-y-1">
                <Label>Role</Label>
                <Select value={data.role[0] ?? ''} onValueChange={(value) => setData('role', [value])}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role.id} value={role.name} className="capitalize">
                                {role.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.role} />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" onClick={onClose} variant="outline">
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : user ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
}
