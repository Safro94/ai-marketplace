import { authClient } from '@/lib/auth-client'

export const useAuth = () => {
  return authClient.useSession()
}
