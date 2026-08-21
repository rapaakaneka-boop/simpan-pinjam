'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Banknote, PiggyBank, FileBarChart } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pinjaman', label: 'Pinjaman', icon: Banknote },
  { href: '/simpanan', label: 'Simpanan', icon: PiggyBank },
  { href: '/laporan', label: 'Laporan', icon: FileBarChart },
]

export default function BottomNav() {
  const pathname = usePathname() || '/'

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/70 bg-[#fafafa] shadow-sm">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-center gap-x-6 px-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 rounded-3xl px-4 py-3 transition duration-200 ${
                isActive
                  ? 'bg-teal-50/80 text-teal-700 shadow-sm before:absolute before:-top-1 before:left-1/2 before:h-0.5 before:w-10 before:-translate-x-1/2 before:rounded-full before:bg-teal-600'
                  : 'text-slate-500 hover:text-teal-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className={`text-sm font-medium ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </footer>
  )
}
