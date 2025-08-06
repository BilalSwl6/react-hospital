import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserFormProps {
  user?: { id: number; name: string; email: string };
  onClose: () => void;
}

export default function UserForm({ user, onClose }: UserFormProps) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      put(route('users.update', user.id), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: onClose,
      });
    } else {
      post(route('users.store'), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: onClose,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={data.name}
        onChange={(e) => setData('name', e.target.value)}
        placeholder="Name"
      />
      <Input
        value={data.email}
        onChange={(e) => setData('email', e.target.value)}
        placeholder="Email"
      />
      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={processing}>
          {user ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
