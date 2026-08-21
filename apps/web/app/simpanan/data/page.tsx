'use client'

import Link from 'next/link'
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
            </div>
        </div>
    )
}
