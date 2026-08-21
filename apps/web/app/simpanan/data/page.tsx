'use client'

import Link from 'next/link'
<<<<<<< Updated upstream
import { useEffect, useState } from 'react'

import { apiFetch } from '@/lib/api'

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0)

export default function DataSimpananPage() {
    const [rows, setRows] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadRows = async () => {
            try {
                setLoading(true)

                const [nasabah, simpananRecords] = await Promise.all([
                    apiFetch('/nasabah').catch(() => []),
                    apiFetch('/simpanan').catch(() => []),
                ])

                const nasabahList = Array.isArray(nasabah) ? nasabah : []
                const records = Array.isArray(simpananRecords) ? simpananRecords : []
                const grouped = new Map<number, {
                    id: number
                    nama: string
                    pekerjaan: string
                    saldoSaatIni: number
                    totalSetoran: number
                    totalPenarikan: number
                    totalBunga: number
                }>()

                for (const record of records) {
                    const nasabahId = Number(record?.nasabahId ?? record?.nasabah?.id)
                    if (!nasabahId) continue

                    const nasabahItem = nasabahList.find((item: any) => Number(item.id) === nasabahId)
                    if (!nasabahItem) continue

                    const existing = grouped.get(nasabahId) ?? {
                        id: nasabahId,
                        nama: nasabahItem.nama,
                        pekerjaan: nasabahItem.pekerjaan || '-',
                        saldoSaatIni: 0,
                        totalSetoran: 0,
                        totalPenarikan: 0,
                        totalBunga: 0,
                    }

                    const jumlahSetoran = Number(record?.jumlahSetoran ?? 0)
                    const saldoAkhir = Number(record?.saldoAkhir ?? 0)
                    const keterangan = String(record?.keterangan ?? '').toLowerCase()

                    existing.totalSetoran += Math.max(jumlahSetoran, 0)
                    existing.totalPenarikan += Math.max(-jumlahSetoran, 0)
                    existing.saldoSaatIni = Math.max(existing.saldoSaatIni, saldoAkhir)
                    if (keterangan.includes('bunga')) {
                        existing.totalBunga += Math.max(jumlahSetoran, 0)
                    }
                    if (Number(record?.bungaSimpanan ?? 0) > 0 && !keterangan.includes('bunga')) {
                        existing.totalBunga += Math.max((Number(record.bungaSimpanan) / 100) * Math.max(saldoAkhir, 0), 0)
                    }

                    grouped.set(nasabahId, existing)
                }

                const rowsToShow = Array.from(grouped.values())
                    .filter((row) => row.saldoSaatIni > 0 || row.totalSetoran > 0 || row.totalPenarikan > 0)
                    .sort((a, b) => b.saldoSaatIni - a.saldoSaatIni)

                setRows(rowsToShow)
            } catch (error) {
                console.error('Gagal memuat data simpanan', error)
                setRows([])
            } finally {
                setLoading(false)
            }
        }

        void loadRows()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Data Simpanan</h2>
                        <p className="mt-2 text-slate-500">Kelola simpanan nasabah dengan mudah.</p>
                    </div>
                    <Link
                        href="/simpanan"
                        className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        Kembali ke Simpanan
                    </Link>
                </header>

                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    {loading ? (
                        <div className="py-10 text-center text-slate-500">Memuat data simpanan...</div>
                    ) : rows.length === 0 ? (
                        <div className="py-10 text-center text-slate-600">Belum ada data simpanan yang tersedia.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm text-slate-700">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="px-3 py-3 font-semibold text-slate-600">Nasabah</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Pekerjaan</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Saldo</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Setoran</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Penarikan</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Bunga</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr key={row.id} className="border-b border-slate-100 last:border-b-0">
                                            <td className="px-3 py-4 font-medium text-slate-900">{row.nama}</td>
                                            <td className="px-3 py-4">{row.pekerjaan}</td>
                                            <td className="px-3 py-4 font-semibold text-slate-900">{formatCurrency(row.saldoSaatIni)}</td>
                                            <td className="px-3 py-4">{formatCurrency(row.totalSetoran)}</td>
                                            <td className="px-3 py-4">{formatCurrency(row.totalPenarikan)}</td>
                                            <td className="px-3 py-4">{formatCurrency(row.totalBunga)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
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

export default function DataSimpananPage() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tableData, setTableData] = useState<SimpananRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDataSimpanan = async () => {
      try {
        setIsLoading(true)
        const nasabahList = await api.getNasabah()

        if (!Array.isArray(nasabahList)) {
          setTableData([])
          return
        }

        const mapped = await Promise.all(
          nasabahList.map(async (nasabah: any, index: number) => {
            const saldoRes = await api.getSaldoNasabah(Number(nasabah.id))
            const saldo = Number(saldoRes?.saldoSaatIni ?? saldoRes?.saldo ?? 0)
            const status = saldo > 0 ? 'AKTIF' : 'TIDAK AKTIF'
            const tipe = nasabah.pekerjaan ?? 'Simpanan Umum'
            const tipeClass = tipe.includes('PNS')
              ? 'bg-sky-100 text-sky-700'
              : tipe.includes('Petani')
                ? 'bg-violet-100 text-violet-700'
                : 'bg-emerald-100 text-emerald-700'

            return {
              nama: nasabah.nama ?? 'Nasabah',
              role: nasabah.pekerjaan ?? 'Anggota',
              rekening: `SP-${String(nasabah.id).padStart(4, '0')}`,
              tipe,
              tipeClass,
              saldo: currencyFormatter.format(saldo),
              status,
              statusClass: status === 'AKTIF' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
              avatar: (nasabah.nama ?? 'N').trim().charAt(0).toUpperCase(),
              avatarClass: index % 2 === 0 ? 'bg-blue-200 text-blue-700' : 'bg-emerald-200 text-emerald-700',
            }
          }),
        )

        setTableData(mapped)
      } catch (error) {
        console.error('Gagal memuat data simpanan', error)
        setTableData([])
      } finally {
        setIsLoading(false)
      }
    }

    loadDataSimpanan()
  }, [])

  return (
    <div className="min-h-screen bg-[#edf1f1] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="flex w-[260px] flex-col border-r border-[#dde4e2] bg-white px-6 py-6">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f8c7b] shadow-sm">
              <div className="h-4 w-4 rounded-md bg-white/90" />
>>>>>>> Stashed changes
            </div>
            <div className="text-[1.05rem] font-bold text-slate-900">Simpan Pinjam</div>
          </div>

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

                <div className="flex items-center gap-2">
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
                <input
                  type="text"
                  placeholder="Masukkan nama nasabah"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white"
                />
              </label>

              <label className="text-sm text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tipe simpanan</span>
                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white">
                  <option>Simpanan Wajib</option>
                  <option>Simpanan Sukarela</option>
                  <option>Deposito</option>
                </select>
              </label>

              <label className="text-sm text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Nominal</span>
                <input
                  type="text"
                  placeholder="Rp 0"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white"
                />
              </label>

              <label className="text-sm text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tanggal setoran</span>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white"
                />
              </label>

              <label className="text-sm text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Periode</span>
                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white">
                  <option>Bulanan</option>
                  <option>3 Bulan</option>
                  <option>6 Bulan</option>
                  <option>12 Bulan</option>
                </select>
              </label>

              <label className="text-sm text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</span>
                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-teal-400 focus:bg-white">
                  <option>Aktif</option>
                  <option>Menunggu Verifikasi</option>
                  <option>Nonaktif</option>
                </select>
              </label>

              <label className="text-sm text-slate-700 md:col-span-2">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Catatan</span>
                <textarea
                  rows={3}
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
                onClick={() => {
                  setIsModalOpen(false)
                  alert('Pengajuan simpanan baru berhasil dibuat.')
                }}
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
