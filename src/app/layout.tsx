import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AADIL — Developer Portfolio',
  description: 'AADIL, first-year Computer Science student, developer and tech enthusiast.',
}

export const viewport: Viewport = {
  themeColor: '#0b0c10',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className="dark"
      data-theme="dark"
      style={{ colorScheme: 'dark', backgroundColor: '#0b0c10', color: '#ecedf0' }}
    >
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#0b0c10" />
        <meta name="darkreader-lock" content="darkreader-lock" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: '#0b0c10', color: '#ecedf0' }}>{children}</body>
    </html>
  )
}
