'use client'

import Link from 'next/link'
<<<<<<< Updated upstream
import { useEffect, useMemo, useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Database, ArrowLeftRight, BookOpen, Landmark, TrendingUp } from 'lucide-react'

import { apiFetch } from '@/lib/api'

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0)

export default function SimpananPage() {
  const [totalBalance, setTotalBalance] = useState(0)
  const [growth, setGrowth] = useState(0)
  const [ldr, setLdr] = useState(0)
  const [inactiveCount, setInactiveCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true)
        const [nasabah, pinjaman, simpanan] = await Promise.all([
          apiFetch('/nasabah').catch(() => []),
          apiFetch('/pinjaman').catch(() => []),
          apiFetch('/simpanan').catch(() => []),
        ])

        const nasabahList = Array.isArray(nasabah) ? nasabah : []
        const pinjamanList = Array.isArray(pinjaman) ? pinjaman : []
        const simpananList = Array.isArray(simpanan) ? simpanan : []

        const total = simpananList.reduce((sum: number, item: any) => sum + Number(item?.saldoAkhir || 0), 0)
        const deposit = simpananList.reduce((sum: number, item: any) => sum + Number(item?.jumlahSetoran > 0 ? item.jumlahSetoran : 0), 0)
        const withdraw = simpananList.reduce((sum: number, item: any) => sum + Number(item?.jumlahSetoran < 0 ? Math.abs(item.jumlahSetoran) : 0), 0)
        const totalPinjaman = pinjamanList.reduce((sum: number, item: any) => sum + Number(item?.jumlahPinjaman ?? item?.jumlah ?? 0), 0)

        const inactive = nasabahList.filter((item: any) => {
          const riwayat = String(item?.riwayatPembayaran ?? '').toLowerCase()
          const hasTunggakan = Boolean(item?.tunggakan ?? item?.adaTunggakan)
          const risky = ['K3', 'K4', 'K5'].includes(String(item?.slik ?? ''))
          return riwayat.includes('telat') || hasTunggakan || risky
        }).length

        const nextGrowth = deposit > 0 ? Number((((deposit - withdraw) / Math.max(deposit, 1)) * 100).toFixed(1)) : 0
        const nextLdr = total > 0 ? Number(((totalPinjaman / total) * 100).toFixed(1)) : 0

        setTotalBalance(total)
        setGrowth(nextGrowth)
        setLdr(nextLdr)
        setInactiveCount(inactive)
      } catch (error) {
        console.error('Gagal memuat ringkasan simpanan', error)
        setTotalBalance(0)
        setGrowth(0)
        setLdr(0)
        setInactiveCount(0)
      } finally {
        setLoading(false)
      }
    }

    void loadSummary()
  }, [])

  const pieData = useMemo(() => {
    const base = totalBalance || 1
    const data = [
      { name: 'Simpanan Pokok', value: Number(((base * 0.26) / base * 100).toFixed(1)), total: formatCurrency(base * 0.26), color: '#93c5fd' },
      { name: 'Simpanan Wajib', value: Number(((base * 0.3) / base * 100).toFixed(1)), total: formatCurrency(base * 0.3), color: '#0d9488' },
      { name: 'Simpanan Sukarela', value: Number(((base * 0.24) / base * 100).toFixed(1)), total: formatCurrency(base * 0.24), color: '#2dd4bf' },
      { name: 'Deposito/Berjangka', value: Number(((base * 0.2) / base * 100).toFixed(1)), total: formatCurrency(base * 0.2), color: '#e2e8f0' },
    ]

    return data
  }, [totalBalance])
=======
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { api } from '@/lib/api'

type SimpananRow = {
  nama: string
  role: string
  rekening: string
  tipe: string
  tipeClass: string
  saldo: string
  status: string
  statusClass: string
  avatar: string
  avatarClass: string
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export default function SimpananPage() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tableData, setTableData] = useState<SimpananRow[]>([])
  const [nasabahOptions, setNasabahOptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState({
    nasabahId: '',
    tipe: 'Simpanan Wajib',
    nominal: '',
    tanggalSetoran: new Date().toISOString().slice(0, 10),
    keterangan: '',
  })

  const loadSimpanan = async () => {
    try {
      setIsLoading(true)
      const nasabahList = await api.getNasabah()

      if (!Array.isArray(nasabahList)) {
        setNasabahOptions([])
        setTableData([])
        return
      }

      setNasabahOptions(nasabahList)

      const mapped = await Promise.all(
        nasabahList.map(async (nasabah: any, index: number) => {
          const saldoRes = await api.getSaldoNasabah(Number(nasabah.id))
          const saldo = Number(saldoRes?.saldoSaatIni ?? saldoRes?.saldo ?? 0)
          const firstLetter = (nasabah.nama ?? 'N').trim().charAt(0).toUpperCase() || 'N'
          const status = saldo > 0 ? 'AKTIF' : 'TIDAK AKTIF'
          const tipe = nasabah.pekerjaan ?? 'Simpanan Umum'
          const tipeClass =
            tipe.includes('PNS') || tipe.includes('Karyawan')
              ? 'bg-sky-100 text-sky-700'
              : tipe.includes('Petani') || tipe.includes('Wiraswasta')
                ? 'bg-violet-100 text-violet-700'
                : 'bg-emerald-100 text-emerald-700'

          return {
            nama: nasabah.nama ?? 'Nasabah',
            role: nasabah.pekerjaan ?? 'Anggota',
            rekening: `SP-${String(nasabah.id).padStart(4, '0')}`,
            tipe: tipe,
            tipeClass,
            saldo: currencyFormatter.format(saldo),
            status,
            statusClass: status === 'AKTIF' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
            avatar: firstLetter,
            avatarClass: index % 2 === 0 ? 'bg-blue-200 text-blue-700' : 'bg-emerald-200 text-emerald-700',
          }
        }),
      )

      setTableData(mapped)
    } catch (error) {
      console.error('Gagal memuat data simpanan', error)
      setNasabahOptions([])
      setTableData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadSimpanan()
  }, [])

  const handleCreateSimpanan = async () => {
    const nasabahId = Number(form.nasabahId)
    const jumlahSetoran = Number(form.nominal)

    if (!nasabahId || !form.tanggalSetoran || !jumlahSetoran || jumlahSetoran <= 0) {
      alert('Pilih nasabah, tanggal setoran, dan nominal simpanan yang valid.')
      return
    }

    try {
      const payload = {
        nasabahId,
        jumlahSetoran,
        bungaSimpanan: form.tipe === 'Simpanan Sukarela' ? 1.5 : 1,
        jenisInterest: 'flat',
        tanggalSetoran: new Date(`${form.tanggalSetoran}T00:00:00`).toISOString(),
        keterangan: form.keterangan || `Setoran ${form.tipe}`,
      }

      await api.createSimpanan(payload)
      setForm({
        nasabahId: '',
        tipe: 'Simpanan Wajib',
        nominal: '',
        tanggalSetoran: new Date().toISOString().slice(0, 10),
        keterangan: '',
      })
      setIsModalOpen(false)
      await loadSimpanan()
      alert('Simpanan berhasil disimpan.')
    } catch (error) {
      console.error('Gagal menambahkan simpanan', error)
      alert(error instanceof Error ? error.message : 'Gagal menambahkan simpanan.')
    }
  }
>>>>>>> Stashed changes

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
        <section className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-8">
          {actionCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
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
              </Link>
            )
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-slate-900">Komposisi Simpanan</h3>
            {loading ? (
              <div className="py-12 text-center text-slate-500">Memuat data simpanan...</div>
            ) : (
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
                        formatter={(value) => [`${value}%`, 'Proporsi']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold text-slate-900">{formatCurrency(totalBalance)}</span>
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
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(totalBalance)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
=======
          <nav className="flex flex-1 flex-col gap-2">
            {[
              { label: 'Dashboard', href: '/' },
              { label: 'Simpanan', href: '/simpanan' },
              { label: 'Pinjaman', href: '/pinjaman' },
              { label: 'Laporan', href: '/laporan' },
            ].map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href)

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
            <div>
              <div className="text-[0.98rem] font-bold text-slate-900">Data Analyst</div>
              <div className="text-sm text-slate-500">admin@koperasi.id</div>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-8 py-8">
          <div className="mx-auto max-w-[1200px]">
            <header className="mb-6 flex items-center justify-between gap-4">
              <h1 className="text-[2.2rem] font-extrabold leading-tight tracking-[-0.04em] text-slate-900">Data Simpanan</h1>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 text-sm font-semibold text-slate-700">
                  DA
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-xl bg-[#0f8c7b] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0d766a]"
                >
                  + Simpanan Baru
                </button>
              </div>
            </header>

            <section className="mb-8 rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Periode</label>
                  <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none" value="01 Mei 2025 - 31 Mei 2025" readOnly />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Status Nasabah</label>
                  <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none">
                    <option>Semua Status</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Tipe Simpanan</label>
                  <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none">
                    <option>Semua Tipe</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Rentang Saldo</label>
                  <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none">
                    <option>Min - Max Saldo</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Filter Aktif:</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Mei 2025</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Semua Tipe</span>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" className="text-sm font-semibold text-slate-500 hover:text-slate-700">Reset Filter</button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                    Terapkan
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-[1.1rem] font-extrabold text-slate-900">Daftar Nasabah Simpanan</h2>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Cari nasabah..."
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                  />
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="py-10 text-center text-sm text-slate-500">Memuat data nasabah simpanan...</div>
                ) : (
                  <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm text-slate-700">
                    <thead>
                      <tr>
                        <th className="px-3 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Nasabah</th>
                        <th className="px-3 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">No. Rekening</th>
                        <th className="px-3 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Tipe Simpanan</th>
                        <th className="px-3 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Saldo</th>
                        <th className="px-3 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
                        <th className="px-3 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Aksi</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tableData.map((row) => (
                        <tr key={row.rekening} className="bg-white shadow-sm ring-1 ring-slate-100 hover:bg-slate-50">
                          <td className="rounded-l-xl px-3 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[0.75rem] font-semibold ${row.avatarClass}`}>
                                {row.avatar}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{row.nama}</div>
                                <div className="text-xs text-slate-500">{row.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4">{row.rekening}</td>
                          <td className="px-3 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${row.tipeClass}`}>
                              {row.tipe}
                            </span>
                          </td>
                          <td className="px-3 py-4 font-semibold text-slate-900">{row.saldo}</td>
                          <td className="px-3 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${row.statusClass}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="rounded-r-xl px-3 py-4">
                            <button type="button" className="text-lg text-slate-500 hover:text-slate-800">⋮</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-500">
                <div>Menampilkan 1 - 4 dari 1,245 nasabah</div>
>>>>>>> Stashed changes

                <div className="flex items-center gap-2">
<<<<<<< Updated upstream
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${ldr >= 80 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {ldr >= 80 ? 'Waspada' : 'Sehat'}
                  </span>
                  <span className="font-bold text-slate-900">{ldr.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <div>
                  <p className="text-sm text-slate-600">Pertumbuhan Dana (Bulan Ini)</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 font-bold">
                  <TrendingUp className="h-4 w-4" />
                  <span>+{growth.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <p className="text-sm text-slate-600">Nasabah Tidak Aktif</p>
                <span className="font-bold text-slate-900">{inactiveCount}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <p className="text-sm text-slate-600">Proyeksi 3 Bulan ke Depan</p>
                <span className="font-bold text-slate-900">{formatCurrency(totalBalance * 1.08)}</span>
=======
                  <button type="button" className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-slate-500 hover:bg-slate-50">&lt;</button>
                  <button type="button" className="rounded-md bg-[#0f8c7b] px-2.5 py-1.5 text-white">1</button>
                  <button type="button" className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-600 hover:bg-slate-50">2</button>
                  <button type="button" className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-600 hover:bg-slate-50">3</button>
                  <span className="px-1 text-slate-400">...</span>
                  <button type="button" className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-600 hover:bg-slate-50">22</button>
                  <button type="button" className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-slate-500 hover:bg-slate-50">&gt;</button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[24px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">Pengajuan</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">Simpanan Baru</h2>
>>>>>>> Stashed changes
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-700 md:col-span-2">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Nama nasabah</span>
                <select
                  value={form.nasabahId}
                  onChange={(event) => setForm((current) => ({ ...current, nasabahId: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white"
                >
                  <option value="">Pilih nasabah</option>
                  {nasabahOptions.map((nasabah: any) => (
                    <option key={nasabah.id} value={nasabah.id}>
                      {nasabah.nama}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tipe simpanan</span>
                <select
                  value={form.tipe}
                  onChange={(event) => setForm((current) => ({ ...current, tipe: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white"
                >
                  <option>Simpanan Wajib</option>
                  <option>Simpanan Sukarela</option>
                  <option>Deposito</option>
                </select>
              </label>

              <label className="text-sm text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Nominal</span>
                <input
                  type="number"
                  min="1"
                  value={form.nominal}
                  onChange={(event) => setForm((current) => ({ ...current, nominal: event.target.value }))}
                  placeholder="Rp 0"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white"
                />
              </label>

              <label className="text-sm text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tanggal setoran</span>
                <input
                  type="date"
                  value={form.tanggalSetoran}
                  onChange={(event) => setForm((current) => ({ ...current, tanggalSetoran: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white"
                />
              </label>

              <label className="text-sm text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</span>
                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white" defaultValue="Aktif">
                  <option>Aktif</option>
                  <option>Menunggu Verifikasi</option>
                  <option>Nonaktif</option>
                </select>
              </label>

              <label className="text-sm text-slate-700 md:col-span-2">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Catatan</span>
                <textarea
                  rows={3}
                  value={form.keterangan}
                  onChange={(event) => setForm((current) => ({ ...current, keterangan: event.target.value }))}
                  placeholder="Tambahkan catatan atau tujuan simpanan"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white"
                />
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreateSimpanan}
                className="rounded-xl bg-[#0f8c7b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d766a]"
              >
                Simpan Pengajuan
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
