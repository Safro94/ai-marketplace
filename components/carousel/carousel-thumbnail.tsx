import React, { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  selected: boolean
  onClick: () => void
}

export const Thumb: React.FC<Props> = ({ selected, children, onClick }) => {
  return (
    <div
      className={'embla-thumbs__slide'.concat(
        selected ? ' embla-thumbs__slide--selected' : '',
      )}
    >
      <button
        onClick={onClick}
        type='button'
        className='embla-thumbs__slide__number'
      >
        {children}
      </button>
    </div>
  )
}
