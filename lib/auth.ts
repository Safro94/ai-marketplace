import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { EMAIL_FROM } from './constants'
import { USER_TYPES } from './types'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const profileExists = await prisma.profile.findUnique({
            where: { userId: user.id },
          })

          if (!profileExists) {
            // Create a profile for the user
            await prisma.profile.create({
              data: {
                userId: user.id ?? '',
                email: user.email,
                name: user.name,
                avatarUrl: user.image,
              },
            })
          }
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    // async sendResetPassword({ user, url }) {
    //   await resend.emails.send({
    //     from: EMAIL_FROM,
    //     to: user.email,
    //     subject: 'Reset your password',
    //     react: await ResetPasswordEmail({
    //       name: user.name,
    //       resetLink: url,
    //     }),
    //   })
    // },
  },
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        subject: 'Verify your email address',
        html: `<a href="${url}">Verify your email address</a>`,
      })
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ['google'],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
      mapProfileToUser: (profile) => {
        return {
          ...profile,
          role: USER_TYPES.USER,
        }
      },
    },
  },
  plugins: [nextCookies()],
})
