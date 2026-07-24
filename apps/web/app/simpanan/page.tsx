'use client'

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Database, ArrowLeftRight, BookOpen, Landmark, TrendingUp } from 'lucide-react'

const actionCards = [
  {
    icon: Database,
    title: 'Data Simpanan',
    description: 'Kelola simpanan nasabah',
    href: '/simpanan/data',
  },
  {
    icon: ArrowLeftRight,
    title: 'Transaksi Simpanan',
    description: 'Catat setoran & penarikan',
    href: '/simpanan/transaksi',
  },
  {
    icon: BookOpen,
    title: 'Buku Tabungan',
    description: 'Lihat riwayat transaksi',
    href: '/simpanan/buku-tabungan',
  },
  {
    icon: Landmark,
    title: 'Deposito',
    description: 'Kelola simpanan berjangka',
    href: '/simpanan/deposito',
  },
]

const pieData = [
  { name: 'Simpanan Pokok', value: 13.5, total: 'Rp 420.000.000', color: '#93c5fd' },
  { name: 'Simpanan Wajib', value: 27.6, total: 'Rp 860.000.000', color: '#0d9488' },
  { name: 'Simpanan Sukarela', value: 39.7, total: 'Rp 1.240.000.000', color: '#2dd4bf' },
  { name: 'Deposito/Berjangka', value: 19.2, total: 'Rp 600.000.000', color: '#e2e8f0' },
]

export default function SimpananPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Simpanan</h2>
          <p className="mt-2 text-slate-500">Kelola data simpanan dan pantau kesehatan dana</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {actionCards.map((card) => {
            const Icon = card.icon
            return (
              <a
                key={card.title}
                href={card.href}
                className="group flex items-start space-x-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{card.description}</p>
                </div>
              </a>
            )
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-slate-900">Komposisi Simpanan</h3>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="relative mx-auto h-80 w-full max-w-[320px] lg:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="90%"
                      stroke="none"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }}
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold text-slate-900">Rp 3,12B</span>
                  <span className="text-xs text-slate-500">Total Dana</span>
                </div>
              </div>

              <div className="space-y-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-900">{item.total}</span>
                      <span className="text-xs text-slate-400">{item.value}%</span>
                    </div>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-600">Total Dana Simpanan</span>
                    <span className="text-sm font-bold text-slate-900">Rp 3.120.000.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-slate-900">Kesehatan Dana</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <div>
                  <p className="text-sm text-slate-600">Loan to Deposit Ratio (LDR)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600">Sehat</span>
                  <span className="font-bold text-slate-900">78,5%</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <div>
                  <p className="text-sm text-slate-600">Pertumbuhan Dana (Bulan Ini)</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 font-bold">
                  <TrendingUp className="h-4 w-4" />
                  <span>+6,2%</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <p className="text-sm text-slate-600">Nasabah Tidak Aktif</p>
                <span className="font-bold text-slate-900">45</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <p className="text-sm text-slate-600">Proyeksi 3 Bulan ke Depan</p>
                <span className="font-bold text-slate-900">Rp 3.450.000.000</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
