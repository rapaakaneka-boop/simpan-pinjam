'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Calendar, ChevronDown, User, LogIn, Settings } from 'lucide-react'
import { getToken, removeToken } from '@/lib/api'

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function getCurrentMonthRange() {
  const now = new Date()
  const month = monthNames[now.getMonth()]
  const year = now.getFullYear()
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
  return `1 ${month} ${year} - ${lastDay} ${month} ${year}`
}

export default function Header() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState(getCurrentMonthRange)
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  const token = getToken()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[#fafafa] shadow-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-3xl border border-teal-200 bg-teal-50 text-teal-700 shadow-sm">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">Simpan Pinjam</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Data Analyst</p>
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDateOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition duration-200 hover:bg-slate-50"
            >
              <Calendar className="h-4 w-4" />
              <span>{dateRange}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {isDateOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                {['Bulan Ini', 'Bulan Lalu', '3 Bulan Terakhir', 'Custom'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setDateRange(option)
                      setIsDateOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 transition duration-200 hover:bg-slate-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-[#fafafa] text-slate-600 shadow-sm transition duration-200 hover:bg-white"
            >
              <User className="h-5 w-5" />
            </button>
            {isUserOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                {!token ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserOpen(false)
                      router.push('/login')
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition duration-200 hover:bg-slate-50"
                  >
                    <LogIn className="h-4 w-4" />
                    Masuk
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserOpen(false)
                        alert('Fitur profil segera tersedia')
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition duration-200 hover:bg-slate-50"
                    >
                      <User className="h-4 w-4" />
                      Profil
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserOpen(false)
                        alert('Fitur pengaturan segera tersedia')
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition duration-200 hover:bg-slate-50"
                    >
                      <Settings className="h-4 w-4" />
                      Pengaturan
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={() => {
                        removeToken()
                        setIsUserOpen(false)
                        router.push('/login')
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 transition duration-200 hover:bg-slate-50"
                    >
                      Keluar
                    </button>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
