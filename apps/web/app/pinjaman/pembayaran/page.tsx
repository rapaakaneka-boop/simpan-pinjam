'use client'

import Link from 'next/link'

export default function PembayaranPage() {
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Pembayaran</h2>
                    <p className="mt-2 text-slate-500">Catat pembayaran cicilan nasabah.</p>
                </header>

                <div className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
                    <p className="text-slate-700">
                        Halaman ini akan menampilkan riwayat pembayaran dan pencatatan cicilan nasabah.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/pinjaman"
                            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                        >
                            Kembali ke Pinjaman
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
