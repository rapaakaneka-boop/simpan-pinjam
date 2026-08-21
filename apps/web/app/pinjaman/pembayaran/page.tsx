"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  TrendingUp,
} from "lucide-react"

import { api } from "@/lib/api"

type PaymentItem = {
  id: number
  namaNasabah: string
  jumlahBayar: number
  tanggalBayar: string
  statusBayar: string
  pinjamanId: number
}
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0)

const formatDate = (value: string) => {
  if (!value) return "-"

  try {
    return new Date(value).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return value
  }
}

export default function PembayaranPage() {
  const [items, setItems] = useState<PaymentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await api.getPembayaran()
        const rows = Array.isArray(data)
          ? data.map((item: any) => ({
              id: Number(item.id ?? 0),
              namaNasabah: item.pinjaman?.nasabah?.nama ?? "Nasabah",
              jumlahBayar: Number(item.jumlahBayar ?? 0),
              tanggalBayar: item.tanggalBayar ?? item.createdAt ?? "",
              statusBayar: item.statusBayar ?? "lancar",
              pinjamanId: Number(item.pinjamanId ?? item.pinjaman?.id ?? 0),
            }))
          : []

        setItems(rows)
      } catch (loadError) {
        console.error("Gagal memuat pembayaran", loadError)
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal memuat data pembayaran."
        )
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [])

  const summary = useMemo(() => {
    const total = items.length
    const lancar = items.filter(
      (item) => item.statusBayar?.toLowerCase() === "lancar"
    ).length
    const telat = items.filter(
      (item) => item.statusBayar?.toLowerCase() === "telat"
    ).length
    const nominal = items.reduce(
      (acc, item) => acc + Number(item.jumlahBayar || 0),
      0
    )

    return { total, lancar, telat, nominal }
  }, [items])

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Pembayaran</h2>
            <p className="mt-2 text-slate-500">
              Catat pembayaran cicilan nasabah.
            </p>
          </div>
          <Link
            href="/pinjaman"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </header>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total bayar</p>
                <p className="text-lg font-bold text-slate-900">
                  {summary.total}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-emerald-700">Lancar</p>
                <p className="text-lg font-bold text-emerald-700">
                  {summary.lancar}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-amber-700">Telat</p>
                <p className="text-lg font-bold text-amber-700">
                  {summary.telat}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-2 text-violet-700">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-violet-700">Nominal</p>
                <p className="text-lg font-bold text-violet-700">
                  {formatCurrency(summary.nominal)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              Memuat riwayat pembayaran...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="py-10 text-center text-slate-600">
              Belum ada data pembayaran yang tercatat.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-3 font-semibold text-slate-600">
                      Nasabah
                    </th>
                    <th className="px-3 py-3 font-semibold text-slate-600">
                      Jumlah
                    </th>
                    <th className="px-3 py-3 font-semibold text-slate-600">
                      Tanggal
                    </th>
                    <th className="px-3 py-3 font-semibold text-slate-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-3 py-4 font-medium text-slate-900">
                        {item.namaNasabah}
                      </td>
                      <td className="px-3 py-4">
                        {formatCurrency(item.jumlahBayar)}
                      </td>
                      <td className="px-3 py-4">
                        {formatDate(item.tanggalBayar)}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.statusBayar?.toLowerCase() === "telat"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {item.statusBayar}
                        </span>
                      </td>
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
