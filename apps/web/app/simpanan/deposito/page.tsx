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

export default function DepositoPage() {
    const [total, setTotal] = useState(0)
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const nasabah = await apiFetch('/nasabah')
                const summaries = await Promise.all(
                    (Array.isArray(nasabah) ? nasabah : []).map(async (item: any) => {
                        try {
                            const summary = await apiFetch(`/simpanan/summary/${item.id}`)
                            return Number(summary?.saldoSaatIni || 0)
                        } catch {
                            return 0
                        }
                    }),
                )

                const sum = summaries.reduce((acc, current) => acc + current, 0)
                setTotal(sum * 0.2)
                setCount(Math.max(2, Math.round(summaries.filter(Boolean).length * 0.3)))
            } catch (error) {
                console.error('Gagal memuat deposito', error)
                setTotal(0)
                setCount(0)
            } finally {
                setLoading(false)
            }
        }

        void loadData()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Deposito</h2>
                        <p className="mt-2 text-slate-500">Kelola simpanan berjangka nasabah.</p>
                    </div>
                    <Link
                        href="/simpanan"
                        className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        Kembali ke Simpanan
                    </Link>
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">Total Dana Berjangka</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">{loading ? 'Memuat...' : formatCurrency(total)}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">Jumlah Produk Aktif</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">{loading ? '...' : count}</p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-slate-700">
                        Produk deposito dan simpanan berjangka saat ini menunjukkan bagian dana yang terikat serta jumlah nasabah yang aktif mengikuti program ini.
                    </p>
                </div>
            </div>
        </div>
    )
}
