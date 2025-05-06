/* eslint-disable @next/next/no-img-element */
import { APP_DATA } from '@/lib/constants'
import { ReactNode } from 'react'
import {
  container,
  content,
  footer,
  footerRights,
  header,
  logoContainer,
  logoText,
} from './styles'

interface TemplateLayoutProps {
  children: ReactNode
  subject: string
}

export const TemplateLayout = ({ children, subject }: TemplateLayoutProps) => (
  <div style={container}>
    <div style={header}>
      <div style={logoContainer}>
        <img
          width={32}
          height={32}
          src='https://mc82uwjjhp.ufs.sh/f/IOa2jOFkt6BpHGICzfXx2X8pmYSuCqlQOWs39TDcvZVg6UKt'
          alt='Logo'
        />

        <span style={logoText}>
          AI<span style={{ color: '#06b6d4' }}>Asset</span>Hub
        </span>
      </div>

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

      <p style={footerRights}>
        © {new Date().getFullYear()} {APP_DATA.name}. All rights reserved.
      </p>
    </div>
  </div>
)
