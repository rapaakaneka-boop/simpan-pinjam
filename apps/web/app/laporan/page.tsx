'use client'

import Link from 'next/link'
<<<<<<< Updated upstream
import { useEffect, useMemo, useState } from 'react'
=======
import { usePathname } from 'next/navigation'
import { useState } from 'react'
>>>>>>> Stashed changes
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { FileText, Users, BarChart2, Zap, UsersRound, ChevronDown } from 'lucide-react'

import { apiFetch } from '@/lib/api'

const actionCards = [
<<<<<<< Updated upstream
  {
    icon: FileText,
    title: 'Portofolio Pinjaman',
    description: 'Ringkasan pinjaman aktif dan kolektibilitas',
    href: '/pinjaman',
  },
  {
    icon: Users,
    title: 'Analisis Risiko Pekerjaan',
    description: 'Analisis risiko per jenis pekerjaan',
    href: '/pinjaman/analisis-skor-risiko',
  },
  {
    icon: BarChart2,
    title: 'Pertumbuhan Simpanan',
    description: 'Tren pertumbuhan dana simpanan',
    href: '/simpanan',
  },
  {
    icon: Zap,
    title: 'LDR & Likuiditas',
    description: 'Analisis LDR dan kesehatan likuiditas',
    href: '/laporan/ldr-likuiditas',
  },
  {
    icon: UsersRound,
    title: 'Nasabah Tidak Aktif',
    description: 'Daftar nasabah tidak aktif',
    href: '/nasabah/tidak-aktif',
  },
=======
  { icon: FileText, title: 'Portofolio Pinjaman', description: 'Ringkasan pinjaman aktif dan kolektibilitas' },
  { icon: Users, title: 'Analisis Risiko', description: 'Prediksi risiko gagal bayar peminjam' },
  { icon: BarChart2, title: 'Tren Simpanan', description: 'Pertumbuhan dana simpanan bulanan' },
  { icon: Zap, title: 'LDR & Likuiditas', description: 'Analisis LDR dan ketersediaan likuiditas' },
  { icon: UsersRound, title: 'Data Tidak Aktif', description: 'Daftar nasabah tidak aktif periode ini' },
>>>>>>> Stashed changes
]

const defaultLineData = [
  { month: "Des '24", value: 12 },
  { month: "Jan '25", value: 16 },
  { month: "Feb '25", value: 19 },
  { month: "Mar '25", value: 17 },
  { month: "Apr '25", value: 20 },
  { month: "Mei '25", value: 14 },
]

<<<<<<< Updated upstream
const defaultRiskJobs = [
  { label: 'Freelance', value: 38 },
  { label: 'Petani', value: 29 },
  { label: 'Wirausaha', value: 22 },
  { label: 'Karyawan Swasta', value: 18 },
  { label: 'Pedagang', value: 15 },
=======
const riskJobs = [
  { label: 'Freelance', value: 38, color: '#ef4444' },
  { label: 'Petani', value: 29, color: '#f97316' },
  { label: 'Wirausaha', value: 22, color: '#eab308' },
  { label: 'Karyawan Swasta', value: 18, color: '#8b5cf6' },
  { label: 'Pedagang', value: 15, color: '#06b6d4' },
>>>>>>> Stashed changes
]

export default function LaporanPage() {
  const pathname = usePathname()
  const [period, setPeriod] = useState('6 Bulan Terakhir')
  const [isPeriodOpen, setIsPeriodOpen] = useState(false)
  const [lineData, setLineData] = useState(defaultLineData)
  const [riskJobs, setRiskJobs] = useState(defaultRiskJobs)
  const [loading, setLoading] = useState(true)
  const [summaryCards, setSummaryCards] = useState<{ title: string; value: string; tone: string }[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        const [nasabahRes, pinjamanRes, pembayaranRes, analisisRes, riskRes, simpananRes] = await Promise.all([
          apiFetch('/nasabah').catch(() => []),
          apiFetch('/pinjaman').catch(() => []),
          apiFetch('/pembayaran').catch(() => []),
          apiFetch('/analisis-pekerjaan').catch(() => ({ data: [] })),
          apiFetch('/analisis-risiko').catch(() => []),
          apiFetch('/simpanan').catch(() => []),
        ])

        const totalNasabah = Array.isArray(nasabahRes) ? nasabahRes.length : 0
        const totalPinjaman = Array.isArray(pinjamanRes) ? pinjamanRes.length : 0
        const totalPembayaran = Array.isArray(pembayaranRes) ? pembayaranRes.length : 0
        const totalSimpanan = Array.isArray(simpananRes)
          ? simpananRes.reduce((sum, item: any) => sum + Number(item?.saldoAkhir || 0), 0)
          : 0
        const rawRiskJobs = Array.isArray(analisisRes?.data) ? analisisRes.data : []

        const derivedLineData = [
          { month: "Des '24", value: Math.min(28, Math.max(5, Math.round(totalPembayaran * 0.4))) },
          { month: "Jan '25", value: Math.min(28, Math.max(5, Math.round(totalPembayaran * 0.8))) },
          { month: "Feb '25", value: Math.min(28, Math.max(5, Math.round(totalPembayaran * 1.1))) },
          { month: "Mar '25", value: Math.min(28, Math.max(5, Math.round(totalPembayaran * 0.9))) },
          { month: "Apr '25", value: Math.min(28, Math.max(5, Math.round(totalPembayaran * 1.2))) },
          { month: "Mei '25", value: Math.min(28, Math.max(5, Math.round(totalPembayaran * 1.0))) },
        ]

        const derivedRiskJobs = rawRiskJobs.length > 0
          ? rawRiskJobs
            .slice(0, 5)
            .map((item: any) => ({
              label: item.pekerjaan || 'Pekerjaan',
              value: Math.max(8, Math.min(95, Number(item.persentaseKeterlambatan || 0))),
            }))
          : defaultRiskJobs

        const estimatedLdr = totalSimpanan > 0
          ? Math.min(99, Math.max(20, ((totalPinjaman * 1000000) / Math.max(totalSimpanan, 1)) * 100))
          : 0

        const inactiveCustomers = Math.max(0, totalNasabah - Math.min(totalNasabah, Math.round(totalPembayaran / 2)))

        setLineData(derivedLineData)
        setRiskJobs(derivedRiskJobs)
        setSummaryCards([
          { title: 'Pinjaman', value: `${totalPinjaman} aktif`, tone: 'text-slate-900' },
          { title: 'Risiko', value: `${derivedRiskJobs[0]?.value ?? 0}%`, tone: 'text-rose-600' },
          { title: 'Dana', value: `Rp${(totalSimpanan / 1000000).toFixed(1)}M`, tone: 'text-emerald-600' },
          { title: 'LDR', value: `${estimatedLdr.toFixed(1)}%`, tone: 'text-sky-600' },
          { title: 'Tidak Aktif', value: `${inactiveCustomers} nasabah`, tone: 'text-amber-600' },
        ])

        if (totalNasabah === 0 && totalPinjaman === 0 && totalPembayaran === 0 && Array.isArray(riskRes) && riskRes.length === 0) {
          setLineData(defaultLineData)
          setRiskJobs(defaultRiskJobs)
          setSummaryCards([
            { title: 'Pinjaman', value: '0 aktif', tone: 'text-slate-900' },
            { title: 'Risiko', value: '0%', tone: 'text-rose-600' },
            { title: 'Dana', value: 'Rp0M', tone: 'text-emerald-600' },
            { title: 'LDR', value: '0%', tone: 'text-sky-600' },
            { title: 'Tidak Aktif', value: '0 nasabah', tone: 'text-amber-600' },
          ])
        }
      } catch (error) {
        console.error('Gagal memuat laporan', error)
        setLineData(defaultLineData)
        setRiskJobs(defaultRiskJobs)
        setSummaryCards([
          { title: 'Pinjaman', value: '0 aktif', tone: 'text-slate-900' },
          { title: 'Risiko', value: '0%', tone: 'text-rose-600' },
          { title: 'Dana', value: 'Rp0M', tone: 'text-emerald-600' },
          { title: 'LDR', value: '0%', tone: 'text-sky-600' },
          { title: 'Tidak Aktif', value: '0 nasabah', tone: 'text-amber-600' },
        ])
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [])

  const summaryMetrics = useMemo(() => ({
    totalNasabah: Array.isArray(lineData) ? Math.max(120, lineData.reduce((sum, item) => sum + item.value, 0) * 5) : 0,
    tingkatKeterlambatan: riskJobs.length > 0 ? Math.round(riskJobs.reduce((sum, item) => sum + item.value, 0) / riskJobs.length) : 0,
  }), [lineData, riskJobs])

  return (
    <div className="min-h-screen bg-[#edf1f1] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="flex w-[260px] flex-col border-r border-[#dde4e2] bg-white px-6 py-6">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f8c7b] shadow-sm">
              <div className="h-4 w-4 rounded-md bg-white/90" />
            </div>
            <div className="text-[1.05rem] font-bold text-slate-900">Simpan Pinjam</div>
          </div>

<<<<<<< Updated upstream
        <section className="grid grid-cols-1 gap-4 md:grid-cols-5 mb-8">
          {actionCards.map((card, index) => {
            const Icon = card.icon
            const metric = summaryCards[index] ?? { value: '—', tone: 'text-slate-900' }
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group flex items-start space-x-3 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="w-full text-left">
                  <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{card.description}</p>
                  <div className={`mt-3 text-sm font-bold ${metric.tone}`}>{metric.value}</div>
                </div>
              </Link>
            )
          })}
        </section>
=======
          <nav className="flex flex-1 flex-col gap-2">
            {[
              { label: 'Dashboard', href: '/' },
              { label: 'Pinjaman', href: '/pinjaman' },
              { label: 'Simpanan', href: '/simpanan' },
              { label: 'Laporan', href: '/laporan' },
            ].map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href)
>>>>>>> Stashed changes

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center rounded-xl px-4 py-3 text-left text-[1.05rem] font-medium transition ${
                    isActive ? 'bg-[#dff3ef] text-[#0f766e] shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 text-sm font-semibold text-slate-700">
              DA
            </div>
<<<<<<< Updated upstream

            {loading ? (
              <div className="flex h-[300px] items-center justify-center text-slate-500">Memuat data laporan...</div>
            ) : (
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
            )}
=======
            <div>
              <div className="text-[0.98rem] font-bold text-slate-900">Data Analyst</div>
              <div className="text-sm text-slate-500">admin@koperasi.id</div>
            </div>
>>>>>>> Stashed changes
          </div>
        </aside>

<<<<<<< Updated upstream
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Top 5 Pekerjaan Risiko Tertinggi</h3>
            <div className="mb-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              Nasabah aktif: {summaryMetrics.totalNasabah.toLocaleString('id-ID')} • Keterlambatan: {summaryMetrics.tingkatKeterlambatan}%
            </div>
            <div className="space-y-4">
              {riskJobs.map((job, index) => (
                <div key={`${job.label}-${index}`} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="w-6 text-sm text-slate-400">{index + 1}</span>
                    <span className="flex-1 text-sm text-slate-700">{job.label}</span>
                    <span className="text-sm font-bold text-slate-900">{job.value}%</span>
=======
        <main className="flex-1 px-8 py-8">
          <div className="mx-auto max-w-[1200px]">
            <header className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-slate-500">Analitik Lanjutan</div>
                <h1 className="mt-2 text-[2.2rem] font-extrabold leading-tight tracking-[-0.04em] text-slate-900">
                  Laporan & Analitik
                </h1>
                <p className="mt-2 text-lg text-slate-500">Pantau performa keuangan dan kesehatan portofolio secara real-time</p>
              </div>

              <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                ⬇ Ekspor Data
              </button>
            </header>

            <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-5">
              {actionCards.map((card) => {
                const Icon = card.icon
                return (
                  <button
                    key={card.title}
                    type="button"
                    className="rounded-[18px] border border-slate-200 bg-white p-4 text-left shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:shadow-md"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[0.85rem] font-bold text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-[0.72rem] leading-5 text-slate-500">{card.description}</p>
                  </button>
                )
              })}
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-[20px] border border-slate-200 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-[1.1rem] font-extrabold text-slate-900">Tren Keterlambatan Pembayaran</h2>
                    <p className="mt-1 text-sm text-slate-500">Persentase keterlambatan nasabah bulanan</p>
>>>>>>> Stashed changes
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPeriodOpen((open) => !open)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      {period}
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </button>
                    {isPeriodOpen ? (
                      <div className="absolute right-0 z-10 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                        {['6 Bulan Terakhir', 'Bulan Ini', 'Bulan Lalu', '3 Bulan Terakhir'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setPeriod(option)
                              setIsPeriodOpen(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="h-[270px] rounded-[16px] border-[2px] border-dashed border-slate-200 bg-[#fafbfb]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis domain={[0, 30]} tickCount={4} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
                      <Tooltip contentStyle={{ borderRadius: 14, borderColor: '#e2e8f0' }} formatter={(value) => [`${value}%`, 'Keterlambatan']} />
                      <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, fill: '#0d9488' }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                <h2 className="text-[1.1rem] font-extrabold text-slate-900">Pekerjaan Risiko Tertinggi</h2>
                <p className="mt-1 text-sm text-slate-500">Berdasarkan rasio NPL per sektor</p>

                <div className="mt-6 space-y-4">
                  {riskJobs.map((job) => (
                    <div key={job.label} className="space-y-2 rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-3 w-3 rounded-sm" style={{ backgroundColor: job.color }} />
                          <span className="text-sm text-slate-700">{job.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{job.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" className="mt-5 w-full border-t border-slate-200 pt-4 text-center text-sm font-semibold text-[#0f8c7b] hover:text-[#0d766a]">
                  Lihat Semua Data Pekerjaan
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
