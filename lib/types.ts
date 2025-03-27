import { Category } from '@prisma/client'

export enum USER_TYPES {
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR',
  USER = 'USER',
}

export type FilterOption = Pick<
  Category,
  'colorClass' | 'name' | 'iconName' | 'id'
>
