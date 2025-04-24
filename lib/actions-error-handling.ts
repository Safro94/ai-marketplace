/**
 * A higher order function that wraps server actions to provide consistent error handling
 *
 * @param serverAction - The server action function to wrap
 * @returns A wrapped function that returns a standardized result object
 */

export const withServerActionErrorHandler = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => Promise<any>,
>(
  serverAction: T,
) => {
  return async (
    ...args: Parameters<T>
  ): Promise<{
    success: boolean
    data?: Awaited<ReturnType<T>>
    error?: string
  }> => {
    try {
      const result = await serverAction(...args)
      return { success: true, data: result }
    } catch (error) {
      console.error('Server action error:', error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      }
    }
  }
}
