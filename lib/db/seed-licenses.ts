import { LICENSE_TYPE } from '../constants'
import prisma from '../prisma'

export const seedLicenses = async () => {
  await prisma.license.upsert({
    where: { id: LICENSE_TYPE.STANDARD },
    update: {},
    create: {
      id: LICENSE_TYPE.STANDARD,
      name: 'Standard License',
      description: 'For personal use or single commercial project',
      features: [
        'Single user',
        'One project or application',
        'Personal or commercial use',
        'No redistribution',
      ],
      isDefault: true,
    },
  })

  await prisma.license.upsert({
    where: { id: LICENSE_TYPE.EXTENDED },
    update: {},
    create: {
      id: LICENSE_TYPE.EXTENDED,
      name: 'Extended License',
      description: 'For commercial use across multiple projects',
      features: [
        'Multiple users (up to 10)',
        'Multiple projects or applications',
        'Commercial use',
        'Limited redistribution rights',
      ],
      isDefault: false,
    },
  })
}
