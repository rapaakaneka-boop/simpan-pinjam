'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { api } from '@/lib/api'

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0)

export default function NasabahTidakAktifPage() {
    const [rows, setRows] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadInactive = async () => {
            try {
                const data = await api.getNasabah()

                const filtered = Array.isArray(data)
                    ? data.filter((item: any) => {
                        const riwayat = String(item?.riwayatPembayaran ?? '').toLowerCase()
                        const isLate = riwayat.includes('telat') || riwayat.includes('late')
                        const hasTunggakan = Boolean(item?.tunggakan ?? item?.adaTunggakan)
                        const isHighRisk = ['K3', 'K4', 'K5'].includes(String(item?.slik ?? ''))
                        return isLate || hasTunggakan || isHighRisk
                    })
                    : []

                setRows(filtered)
            } catch (error) {
                console.error('Gagal memuat nasabah tidak aktif', error)
                setRows([])
            } finally {
                setLoading(false)
            }
        }

        void loadInactive()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Nasabah Tidak Aktif</h2>
                        <p className="mt-2 text-slate-500">Daftar nasabah dengan riwayat terlambat, tunggakan, atau risiko tinggi.</p>
                    </div>
                    <Link
                        href="/laporan"
                        className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        Kembali ke Laporan
                    </Link>
                </header>

                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    {loading ? (
                        <div className="py-10 text-center text-slate-500">Memuat daftar nasabah tidak aktif...</div>
                    ) : rows.length === 0 ? (
                        <div className="py-10 text-center text-slate-600">Belum ada nasabah dengan status tidak aktif.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm text-slate-700">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="px-3 py-3 font-semibold text-slate-600">Nama</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Pekerjaan</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Riwayat</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">SLIK</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Penghasilan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr key={row.id} className="border-b border-slate-100 last:border-b-0">
                                            <td className="px-3 py-4 font-medium text-slate-900">{row.nama}</td>
                                            <td className="px-3 py-4">{row.pekerjaan || 'Belum diisi'}</td>
                                            <td className="px-3 py-4">
                                                <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                                    {row.riwayatPembayaran || 'Telat'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 font-semibold text-slate-900">{row.slik || 'K3'}</td>
                                            <td className="px-3 py-4">{formatCurrency(Number(row.penghasilan || 0))}</td>
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
