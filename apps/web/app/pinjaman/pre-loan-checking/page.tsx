"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, CheckCircle2, CircleAlert, SearchCheck } from "lucide-react"

import { api } from "@/lib/api"

type CheckingItem = {
  id: number
  nama: string
  pekerjaan: string
  penghasilan: number
  cicilan: number
  riwayatPembayaran: string
  rasio: number
  risk: "Layak" | "Review" | "Bermasalah"
  insight: string
}
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0)

export default function PreLoanCheckingPage() {
  const [items, setItems] = useState<CheckingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await api.getNasabah()
        const rows = Array.isArray(data)
          ? data.map((item: any) => {
              const penghasilan = Number(item.penghasilan ?? 0)
              const cicilan = Number(item.cicilan ?? item.cicilanBulanan ?? 0)
              const rasio = penghasilan > 0 ? (cicilan / penghasilan) * 100 : 0

              let risk: CheckingItem["risk"] = "Layak"
              let insight = "Rasio cicilan masih aman."

              if (
                rasio > 35 ||
                item.riwayatPembayaran === "telat" ||
                item.slik === "K3"
              ) {
                risk = "Bermasalah"
                insight =
                  "Rasio cicilan tinggi dan riwayat pembayaran perlu ditinjau ulang."
              } else if (rasio > 25 || item.riwayatPembayaran === "Review") {
                risk = "Review"
                insight = "Perlu verifikasi tambahan sebelum approval."
              }

              return {
                id: Number(item.id ?? 0),
                nama: item.nama ?? "Nasabah",
                pekerjaan: item.pekerjaan ?? "Tidak diketahui",
                penghasilan,
                cicilan,
                riwayatPembayaran: item.riwayatPembayaran ?? "Belum ada data",
                rasio,
                risk,
                insight,
              }
            })
          : []

        setItems(rows)
      } catch (loadError) {
        console.error("Gagal memuat data pre-loan checking", loadError)
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal memuat data pre-loan checking."
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
    const layak = items.filter((item) => item.risk === "Layak").length
    const review = items.filter((item) => item.risk === "Review").length
    const bermasalah = items.filter((item) => item.risk === "Bermasalah").length

    return { total, layak, review, bermasalah }
  }, [items])

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Pre-Loan Checking
            </h2>
            <p className="mt-2 text-slate-500">
              Cek kelayakan awal sebelum pengajuan.
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
            <p className="text-sm text-slate-500">Total</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {summary.total}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-sm text-emerald-700">Layak</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {summary.layak}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-sm text-amber-700">Review</p>
            <p className="mt-2 text-3xl font-bold text-amber-700">
              {summary.review}
            </p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
            <p className="text-sm text-rose-700">Bermasalah</p>
            <p className="mt-2 text-3xl font-bold text-rose-700">
              {summary.bermasalah}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              Memuat data kelayakan nasabah...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="space-y-4 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <SearchCheck className="h-6 w-6" />
              </div>
              <p className="text-lg text-slate-600">
                Belum ada data nasabah untuk dicek kelayakan.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {item.nama}
                      </p>
                      <p className="text-sm text-slate-500">{item.pekerjaan}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.risk === "Layak"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.risk === "Review"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {item.risk}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Penghasilan
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {formatCurrency(item.penghasilan)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Cicilan
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {formatCurrency(item.cicilan)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-400 uppercase">Rasio</p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {item.rasio.toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Riwayat
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {item.riwayatPembayaran}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-3 rounded-lg bg-white p-3 text-sm text-slate-600">
                    {item.risk === "Bermasalah" ? (
                      <CircleAlert className="mt-0.5 h-4 w-4 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                    )}
                    <span>{item.insight}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
