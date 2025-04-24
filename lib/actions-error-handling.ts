/**
 * A higher order function that wraps functions to provide consistent error handling
 *
 * @param fn - The function to wrap
 * @returns A wrapped function that returns a standardized result object
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withErrorHandler = <T extends (...args: any[]) => Promise<any>>(
  serverAction: T,
) => {
  return async (
    ...args: Parameters<T>
  ): Promise<{
    data?: Awaited<ReturnType<T>>
    error?: string
  }> => {
    try {
      const result = await serverAction(...args)
      return { data: result }
    } catch (error) {
      console.error('Server action error:', error)
      // Return error instead of re-throwing it
      return {
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      }
    }
  }
}

export async function tryCatch<T, E = Error>(promise: Promise<T>) {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: error as E }
  }
}
