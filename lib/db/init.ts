import { PrismaClient } from '@prisma/client'
import { seedCategories } from './seed-categories'

export async function initializeDatabase(prisma: PrismaClient) {
  try {
    // Check if categories exist
    const categoriesCount = await prisma.category.count()

    // Seed categories if none exist
    if (categoriesCount === 0) {
      await seedCategories()
      console.log('Database initialized with categories')
    }
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}
