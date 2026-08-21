"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"

import { api } from "@/lib/api"

type RiskItem = {
  id: number
  nasabahId: number
  namaNasabah: string
  pekerjaan: string
  penghasilan: number
  status: string
  totalSkor: number
  skorPekerjaan: number
  skorPenghasilan: number
  skorLamaBekerja: number
  skorRiwayat: number
  skorTanggungan: number
  riwayatPembayaran: string
  jumlahTanggungan: number
}
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0)

const getStatusBadge = (status: string) => {
  const normalized = status?.toLowerCase() || ""

  if (
    normalized === "layak" ||
    normalized === "approve" ||
    normalized === "lolos"
  ) {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
  }

  if (
    normalized === "review" ||
    normalized === "perlu review" ||
    normalized === "sedang"
  ) {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
  }

  return "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
}

export default function AnalisisSkorRisikoPage() {
  const [items, setItems] = useState<RiskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await api.getAnalisisRisiko()
        const rows = Array.isArray(data)
          ? data.map((item: any) => ({
              id: item.id ?? Date.now(),
              nasabahId: item.nasabahId ?? 0,
              namaNasabah: item.namaNasabah ?? item.nama ?? "Nasabah",
              pekerjaan: item.pekerjaan ?? "Tidak diketahui",
              penghasilan: Number(item.penghasilan ?? 0),
              status: item.status ?? "Review",
              totalSkor: Number(item.totalSkor ?? 0),
              skorPekerjaan: Number(item.skorPekerjaan ?? 0),
              skorPenghasilan: Number(item.skorPenghasilan ?? 0),
              skorLamaBekerja: Number(item.skorLamaBekerja ?? 0),
              skorRiwayat: Number(item.skorRiwayat ?? 0),
              skorTanggungan: Number(item.skorTanggungan ?? 0),
              riwayatPembayaran: item.riwayatPembayaran ?? "Nasabah Baru",
              jumlahTanggungan: Number(item.jumlahTanggungan ?? 0),
            }))
          : []

        setItems(rows)
      } catch (loadError) {
        console.error("Gagal memuat analisis risiko", loadError)
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal memuat analisis risiko."
        )
        setItems([])
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
            <h2 className="text-2xl font-bold text-slate-900">
              Analisis & Skor Risiko
            </h2>
            <p className="mt-2 text-slate-500">
              Analisis risiko otomatis berbasis data.
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              Memuat data analisis risiko...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="space-y-4 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-lg text-slate-600">
                Belum ada data analisis risiko yang tersedia.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {item.namaNasabah}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.pekerjaan} • {formatCurrency(item.penghasilan)}
                        /bulan
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">Total skor</span>
                      <span className="text-2xl font-black text-slate-900">
                        {item.totalSkor}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadge(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Pekerjaan
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {item.skorPekerjaan}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Penghasilan
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {item.skorPenghasilan}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Lama kerja
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {item.skorLamaBekerja}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Riwayat pembayaran
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {item.skorRiwayat}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Tanggungan
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {item.skorTanggungan}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Riwayat: {item.riwayatPembayaran}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Jumlah tanggungan: {item.jumlahTanggungan}
                    </span>
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
