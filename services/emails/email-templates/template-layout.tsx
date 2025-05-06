import { APP_DATA } from '@/lib/constants'
import { ReactNode } from 'react'
import { container, content, footer, header } from './styles'

interface TemplateLayoutProps {
  children: ReactNode
  subject: string
}

export const TemplateLayout = ({ children, subject }: TemplateLayoutProps) => (
  <div style={container}>
    <div style={header}>
      <h2>{subject}</h2>
    </div>

    <div style={content}>{children}</div>

    <p>
      Best Regards,
      <br />
      <strong>{APP_DATA.name} Team</strong>
    </p>

    <div style={footer}>
      <a href={APP_DATA.url} target='_blank'>
        {APP_DATA.url}
      </a>
      <p>
        © {new Date().getFullYear()} {APP_DATA.name}. All rights reserved.
      </p>
    </div>
  </div>
)
