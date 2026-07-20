'use client'

import { useState } from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { FileText, Users, BarChart2, Zap, UsersRound, ChevronDown } from 'lucide-react'

const actionCards = [
  {
    icon: FileText,
    title: 'Portofolio Pinjaman',
    description: 'Ringkasan pinjaman aktif dan kolektibilitas',
  },
  {
    icon: Users,
    title: 'Analisis Risiko Pekerjaan',
    description: 'Analisis risiko per jenis pekerjaan',
  },
  {
    icon: BarChart2,
    title: 'Pertumbuhan Simpanan',
    description: 'Tren pertumbuhan dana simpanan',
  },
  {
    icon: Zap,
    title: 'LDR & Likuiditas',
    description: 'Analisis LDR dan kesehatan likuiditas',
  },
  {
    icon: UsersRound,
    title: 'Nasabah Tidak Aktif',
    description: 'Daftar nasabah tidak aktif',
  },
]

const lineData = [
  { month: "Des '24", value: 12 },
  { month: "Jan '25", value: 16 },
  { month: "Feb '25", value: 19 },
  { month: "Mar '25", value: 17 },
  { month: "Apr '25", value: 20 },
  { month: "Mei '25", value: 14 },
]

const riskJobs = [
  { label: 'Freelance', value: 38 },
  { label: 'Petani', value: 29 },
  { label: 'Wirausaha', value: 22 },
  { label: 'Karyawan Swasta', value: 18 },
  { label: 'Pedagang', value: 15 },
]

export default function LaporanPage() {
  const [period, setPeriod] = useState('6 Bulan Terakhir')
  const [isPeriodOpen, setIsPeriodOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Laporan & Analitik</h2>
          <p className="mt-2 text-slate-500">Lihat laporan dan analisis data untuk pengambilan keputusan</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {actionCards.map((card) => {
            const Icon = card.icon
            return (
              <button
                key={card.title}
                type="button"
                onClick={() => alert(`Fitur ${card.title} akan segera tersedia`)}
                className="group flex items-start space-x-3 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{card.description}</p>
                </div>
              </button>
            )
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-slate-900">Tren Keterlambatan Pembayaran</h3>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPeriodOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm"
                >
                  {period}
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                {isPeriodOpen ? (
                  <div className="absolute right-0 z-10 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    {['Bulan Ini', 'Bulan Lalu', '3 Bulan Terakhir', 'Custom'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setPeriod(option)
                          setIsPeriodOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis domain={[0, 30]} tickCount={4} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} formatter={(value) => `${value}%`} />
                  <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4, fill: '#38bdf8' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Top 5 Pekerjaan Risiko Tertinggi</h3>
            <div className="space-y-4">
              {riskJobs.map((job, index) => (
                <div key={job.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="w-6 text-sm text-slate-400">{index + 1}</span>
                    <span className="flex-1 text-sm text-slate-700">{job.label}</span>
                    <span className="text-sm font-bold text-slate-900">{job.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full bg-red-400" style={{ width: `${job.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
