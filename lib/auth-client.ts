import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL, // the base url of your auth server,
  plugins: [
    adminClient(),
    inferAdditionalFields({
      user: {
        role: {
          type: 'string',
        },
        banned: {
          type: 'boolean',
        },
      },
    }),
  ],
})
