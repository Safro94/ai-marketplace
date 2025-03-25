import { PrismaClient } from '@prisma/client'
import { initializeDatabase } from './db/init'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  // Initialize database with seed data if needed
  initializeDatabase(prisma)
}

export default prisma
