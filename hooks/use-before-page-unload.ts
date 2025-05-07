import { useEffect } from 'react'

export const useBeforePageUnload = (showConfirmation: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (showConfirmation) {
        const message = 'Are you sure you want to leave?'
        event.preventDefault()
        event.returnValue = message
        return message
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [showConfirmation])
}
