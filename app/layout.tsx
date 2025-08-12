import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import ThemeProvider from '@/components/custom/theme-provider'
import Footer from '@/components/custom/footer'
import Hero from '@/components/custom/hero'
import AudioControls from '@/components/custom/audio-controls'

import QueryProvider from '@/components/custom/query-provider'
import './globals.css'

const quicksand = Quicksand({ subsets: ['latin'], weight: ['400'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Fin de Semana Largos',
  description: 'Calculadora de fines de semana largos',
  metadataBase: new URL('https://weekend.brianbastias.cl'),
  openGraph: {
    title: 'Fin de Semana Largos',
    description: 'Calculadora de fines de semana largos',
    url: 'https://weekend.brianbastias.cl',
    siteName: 'Fin de Semana Largos',
    images: [
      {
        url: '/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Fin de Semana Largos',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fin de Semana Largos',
    description: 'Calculadora de fines de semana largos',
    images: [
      {
        url: '/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Fin de Semana Largos',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Fin de Semana Largos',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={quicksand.className}>
      <body className="flex flex-col min-h-screen">
        <QueryProvider>
          <ThemeProvider>
            <Hero />
            <div className="flex flex-col flex-1 justify-between items-center pt-8 w-full">
              <div className="w-full px-2 md:px-4 flex-1">{children}</div>
              <AudioControls />
            </div>
            <Footer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
