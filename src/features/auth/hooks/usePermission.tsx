'use client';
import { UserAccountRole } from '../type';
import { useUserAccount } from './useUserAccount';

export type Permission =
  | 'READ:PUBLIC'
  | 'READ:DRAFT'
  | 'EDIT'
  | 'SAVE:DRAFT'
  | 'SAVE:PUBLIC'
  | 'DELETE';

const ROLE_PERMISSIONS: Record<UserAccountRole, ReadonlySet<Permission>> = {
  ADMIN: new Set([
    'READ:PUBLIC',
    'READ:DRAFT',
    'EDIT',
    'SAVE:DRAFT',
    'SAVE:PUBLIC',
    'DELETE',
  ]),

  DEMO: new Set(['READ:PUBLIC', 'EDIT']),

  GUEST: new Set(['READ:PUBLIC']),
};

export const usePermission = () => {
  const { userRole } = useUserAccount();

  const can = (permission: Permission) => {
    return ROLE_PERMISSIONS[userRole].has(permission);
  };

  return { can };
};
