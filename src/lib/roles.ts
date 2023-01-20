import type { Role } from '@prisma/client'

export const Store: Role[] = ['Store', 'Manager', 'Admin']
export const Manager: Role[] = ['Manager', 'Admin']
export const Admin: Role[] = ['Admin']
