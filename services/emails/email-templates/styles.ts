import { CSSProperties } from 'react'

export const container: CSSProperties = {
  maxWidth: '600px',
  margin: '20px auto',
  background: '#FFFFFF',
}

export const header: CSSProperties = {
  textAlign: 'center',
  background: 'hsl(264.7, 66.7%, 20%)',
  color: '#FFFFFF',
  padding: '1rem',
}

export const content: CSSProperties = {
  padding: 0,
}

export const footer: CSSProperties = {
  textAlign: 'center',
  fontSize: '14px',
  padding: '10px',
}

export const footerRights: CSSProperties = {
  margin: 0,
}

export const logoContainer: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}

export const logoText: CSSProperties = {
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  fontWeight: 700,
  color: '#FFF',
  backgroundClip: 'text',
}
