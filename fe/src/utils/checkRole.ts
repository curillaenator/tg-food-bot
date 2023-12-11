import { Role, User } from '../shared/interfaces';

export const isManager = (role?: Role): boolean => role === 'admin' || role === 'manager';

export const isEmployee = (role?: Role): boolean => role === 'employee';

export const isServiceOwner = (ownerOf?: User['ownerOf']): boolean => !!Object.keys(ownerOf || {}).length;
