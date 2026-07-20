import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import '@workspace/ui/src/styles/globals.css'
import BottomNav from '@/components/bottom-nav'
import Header from '@/components/header'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['600', '700'],
})

export const metadata: Metadata = {
  title: 'Simpan Pinjam',
  description: 'Sistem manajemen Simpan Pinjam',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-white text-slate-800">
        <Header />

        <main className="mx-auto max-w-[1440px] px-8 py-4 mb-20">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  )
}
