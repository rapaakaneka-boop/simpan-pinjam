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

const formatDate = (value: string) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export default function BukuTabunganPage() {
    const [rows, setRows] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadRows = async () => {
            try {
                const nasabah = await apiFetch('/nasabah')
                const flatRows: any[] = []

                for (const customer of Array.isArray(nasabah) ? nasabah : []) {
                    try {
                        const response = await apiFetch(`/simpanan/nasabah/${customer.id}`)
                        const records = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []
                        records.forEach((record: any) => {
                            flatRows.push({
                                id: `${customer.id}-${record.id}`,
                                nama: customer.nama,
                                tanggal: record.tanggalSetoran || record.createdAt,
                                keterangan: record.keterangan || 'Transaksi buku tabungan',
                                nominal: Number(record.jumlahSetoran || 0),
                                saldo: Number(record.saldoAkhir || 0),
                                status: record.status || 'aktif',
                            })
                        })
                    } catch {
                        // ignore failed customer summary
                    }
                }

                setRows(flatRows.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()))
            } catch (error) {
                console.error('Gagal memuat buku tabungan', error)
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
                        <h2 className="text-2xl font-bold text-slate-900">Buku Tabungan</h2>
                        <p className="mt-2 text-slate-500">Lihat riwayat transaksi simpanan nasabah.</p>
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
                        <div className="py-10 text-center text-slate-500">Memuat buku tabungan...</div>
                    ) : rows.length === 0 ? (
                        <div className="py-10 text-center text-slate-600">Belum ada transaksi buku tabungan.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm text-slate-700">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="px-3 py-3 font-semibold text-slate-600">Nasabah</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Tanggal</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Keterangan</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Nominal</th>
                                        <th className="px-3 py-3 font-semibold text-slate-600">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr key={row.id} className="border-b border-slate-100 last:border-b-0">
                                            <td className="px-3 py-4 font-medium text-slate-900">{row.nama}</td>
                                            <td className="px-3 py-4">{formatDate(row.tanggal)}</td>
                                            <td className="px-3 py-4">{row.keterangan}</td>
                                            <td className={`px-3 py-4 font-semibold ${row.nominal >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                                                {formatCurrency(row.nominal)}
                                            </td>
                                            <td className="px-3 py-4">{formatCurrency(row.saldo)}</td>
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
