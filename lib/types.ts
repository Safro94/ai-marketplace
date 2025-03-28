export enum USER_TYPES {
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR',
  USER = 'USER',
}

export interface LicenseOption {
  id: string
  licenseId: string
  name: string
  description: string
  features: string[]
  price: number
}
