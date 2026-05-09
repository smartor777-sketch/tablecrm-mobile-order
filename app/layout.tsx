import type { Metadata } from 'next'
import { Rubik, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/context/AppContext'

const rubik = Rubik({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-rubik',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'TableCRM Mobile Order',
  description: 'Мобильная форма оформления заказов для tablecrm.com',
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${rubik.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}