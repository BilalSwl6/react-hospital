import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface UserFormProps {
  user?: { id: number; name: string; email: string; password?: string };
  onClose: () => void;
}

export default function UserForm({ user, onClose }: UserFormProps) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      put(route('users.update', user.id), {
        ...data,
        ...(data.password === '' && { password: undefined }),
        preserveScroll: true,
        preserveState: true,
        onSuccess: onClose,
      });
    } else {
      post(route('users.store'), {
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
        <Input
          id="name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          placeholder="Name"
        />
        <InputError message={errors.name} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          placeholder="Email"
          type="email"
        />
        <InputError message={errors.email} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password {user && <span className="text-sm text-muted-foreground">(leave empty to keep current)</span>}</Label>
        <Input
          id="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          type="password"
          placeholder="Password"
        />
        <InputError message={errors.password} />
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
