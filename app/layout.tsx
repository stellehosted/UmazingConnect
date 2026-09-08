import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { ServiceWorkerRegister } from '@/components/service-worker-register'

export const metadata: Metadata = {
  title: 'The Compass',
  description:
    'Connect with your school community. Share updates, join clubs, and stay informed about campus life.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'The Compass',
  },
  icons: {
    icon: '/icon-192.png',
    shortcut: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  // Let full-bleed screens paint into the notch/home-indicator areas instead
  // of leaving Safari's chrome showing the default page background.
  viewportFit: 'cover',
}

// ✅ Combine your fonts once outside the component (server-safe)
const fontVars = `${GeistSans.variable} ${GeistMono.variable}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ✅ Apply deterministic, precomputed font vars */}
      <body className={`font-sans ${fontVars}`} suppressHydrationWarning>
        <ServiceWorkerRegister />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false} // 🔧 make deterministic theme
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
