import { toast } from '@/components/ui/toast'
import { useReCaptcha } from 'next-recaptcha-v3'

export const useValidateCaptcha = () => {
  const { executeRecaptcha } = useReCaptcha()

  const validateCaptcha = async () => {
    const token = await executeRecaptcha('form_submit')

    if (!token) {
      toast.error('Recaptcha failed')
      throw Error('Recaptcha failed')
    }
  }

  return { validateCaptcha }
}
