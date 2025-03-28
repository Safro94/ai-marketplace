import { PrismaClient } from '@prisma/client'
import { seedCategories } from './seed-categories'
import { seedLicenses } from './seed-licenses'

export async function initializeDatabase(prisma: PrismaClient) {
  try {
    const categoriesCount = await prisma.category.count()
    const licensesCount = await prisma.license.count()

    if (!categoriesCount) {
      await seedCategories()
      console.log('Database initialized with categories')
    }

    if (!licensesCount) {
      await seedLicenses()
      console.log('Database initialized with licenses')
    }
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}
