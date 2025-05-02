import { FC, PropsWithChildren } from 'react'

export const AssetActionsContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='absolute right-2 md:right-3 top-3 flex flex-col items-center gap-2'>
      {children}
    </div>
  )
}
