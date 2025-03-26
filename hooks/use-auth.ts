import { authClient } from '@/lib/auth-client'

export const useAuth = () => {
  const { data, isPending, error } = authClient.useSession()
  const user = data?.user
  const session = data?.session

  return {
    error,
    isPending,
    user,
    session,
  }
}
