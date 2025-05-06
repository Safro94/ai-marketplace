import RandExp from 'randexp'
import prisma from './prisma'

const VALID_CHARS = '[a-zA-Z0-9!@#$%^&*_-]{8}'

export const createAffiliateCode = async () => {
  let isUnique = false
  let code
  let attempts = 0
  const maxAttempts = 5

  while (!isUnique && attempts < maxAttempts) {
    code = generateAffiliateCode()

    const existingCode = await prisma.affiliateCode.findUnique({
      where: { code },
    })

    if (!existingCode) {
      isUnique = true
    } else {
      attempts++
    }
  }

  if (!isUnique) {
    throw new Error(
      'Unable to generate a unique affiliate code after multiple attempts',
    )
  }

  return code
}

const generateAffiliateCode = () => {
  try {
    const code = new RandExp(VALID_CHARS).gen()

    return code.toUpperCase()
  } catch (error) {
    throw new Error(
      `Error generating affiliate code: ${error instanceof Error ? error.message : error}`,
    )
  }
}
