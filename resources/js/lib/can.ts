import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export function can(permission: string): boolean {
  const { auth } = usePage<SharedData>().props;

  return auth?.permissions?.includes(permission) ?? false;
}
