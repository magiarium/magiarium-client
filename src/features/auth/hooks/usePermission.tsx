'use client';
import { AccountRole } from '../type';
import { useUserData } from './useUserData';

/**
 * 認可対象となる操作
 */
export type Permission =
  | 'READ:PUBLIC'
  | 'READ:DRAFT'
  | 'EDIT'
  | 'SAVE:DRAFT'
  | 'SAVE:PUBLIC'
  | 'DELETE';

/**
 * アカウントロールごとの認可対象操作。
 */
const ROLE_PERMISSIONS: Record<AccountRole, ReadonlySet<Permission>> = {
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

/**
 * カレントアカウントロールに基づいて、指定した権限を保有しているか判定するフック。
 *
 * @returns 指定した権限を保有しているか判定する関数
 */
export const usePermission = () => {
  const { curretnAccountRole } = useUserData();

  /**
   * 指定した権限を保有しているか判定する。
   *
   * @param permission 判定対象の権限
   * @returns 権限を保有している場合は`true`
   */
  const can = (permission: Permission) => {
    return ROLE_PERMISSIONS[curretnAccountRole].has(permission);
  };

  return { can };
};
