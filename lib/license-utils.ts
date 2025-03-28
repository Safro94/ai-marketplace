import { createHash } from 'crypto'

/**
 * Generates a simple license key for a purchase
 */
export function generateLicenseKey(userId: string, assetId: string): string {
  // Create a unique string based on user, asset, and timestamp
  const uniqueString = `${userId}-${assetId}-${Date.now()}`

  // Create a hash of the unique string
  const hash = createHash('sha256').update(uniqueString).digest('hex')

  // Format the hash into a license key format (XXXX-XXXX-XXXX-XXXX)
  const segments = []
  for (let i = 0; i < 16; i += 4) {
    segments.push(hash.substring(i, i + 4))
  }

  return segments.join('-').toUpperCase()
}

/**
 * Gets license terms as a formatted string
 */
export function getLicenseTerms(licenseName: string): string {
  switch (licenseName) {
    case 'Standard License':
      return `
# Standard License Terms

This Standard License ("License") is a legal agreement between you and the creator of the AI asset ("Asset") that you have purchased. By purchasing and using the Asset, you agree to be bound by the terms of this License.

## 1. Grant of License

Subject to your payment of the applicable license fee and your compliance with the terms of this License, you are granted a non-exclusive, non-transferable license to use the Asset subject to the following conditions:

- You may use the Asset for personal or commercial purposes in a single project or application
- The Asset may be used by a single user only
- You may not redistribute, resell, lease, license, sub-license or offer the Asset to any third party

## 2. Restrictions

You may not:
- Use the Asset in multiple projects or applications
- Allow multiple users to use the Asset
- Redistribute the Asset as part of a product or service
- Claim ownership or authorship of the Asset

## 3. Termination

This License will terminate automatically if you fail to comply with any of its terms. Upon termination, you must cease all use of the Asset and destroy all copies.
      `
    case 'Extended License':
      return `
# Extended License Terms

This Extended License ("License") is a legal agreement between you and the creator of the AI asset ("Asset") that you have purchased. By purchasing and using the Asset, you agree to be bound by the terms of this License.

## 1. Grant of License

Subject to your payment of the applicable license fee and your compliance with the terms of this License, you are granted a non-exclusive, non-transferable license to use the Asset subject to the following conditions:

- You may use the Asset for commercial purposes in multiple projects or applications
- The Asset may be used by up to 10 users within your organization
- You may incorporate the Asset into products or services with limited redistribution rights
- You may not resell the Asset as a standalone product

## 2. Restrictions

You may not:
- Allow more than 10 users to use the Asset
- Redistribute the Asset as a standalone product
- Claim ownership or authorship of the Asset

## 3. Termination

This License will terminate automatically if you fail to comply with any of its terms. Upon termination, you must cease all use of the Asset and destroy all copies.
      `
    default:
      return 'License terms not available.'
  }
}
