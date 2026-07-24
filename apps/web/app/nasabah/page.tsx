'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'

import { api } from '@/lib/api'

type Nasabah = {
  id: string
  nama: string
  nik: string
  noRek: string
  hp: string
  email: string
  lahir: string
  alamat: string
  ibu: {
    nama: string
    lahir: string
    alamat: string
  }
  kerja: string
  gaji: number
  cicilan: number
  riwayat: 'Lancar' | 'Telat'
  slik: 'K1' | 'K2' | 'K3' | 'K4' | 'K5'
  hutangLain: number
  lembaga: number
  tunggakan: boolean
  catatan?: string
  rasio?: number
  risiko?: 'Rendah' | 'Sedang' | 'Tinggi'
}

type NasabahForm = {
  nama: string
  nik: string
  noRek: string
  hp: string
  email: string
  lahir: string
  alamat: string
  ibuNama: string
  ibuLahir: string
  ibuAlamat: string
  kerja: string
  gaji: string
  cicilan: string
  riwayat: Nasabah['riwayat']
  slik: Nasabah['slik']
  lembaga: string
  hutangLain: string
  tunggakan: 'Tidak Ada' | 'Ada Tunggakan'
  catatan: string
}

type UiState = {
  isModalOpen: boolean
  activeNasabahId: string | null
  isDetailOpen: boolean
  selectedNasabah: Nasabah | null
}

type SubmitState = {
  isSubmitting: boolean
  message: string | null
  error: string | null
}

const pekerjaanOptions = ['PNS', 'Wiraswasta', 'Freelance', 'Petani', 'Buruh', 'Lainnya']
const riwayatOptions: Nasabah['riwayat'][] = ['Lancar', 'Telat']
const currencyFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

const initialForm: NasabahForm = {
  nama: '',
  nik: '',
  noRek: '',
  hp: '',
  email: '',
  lahir: '',
  alamat: '',
  ibuNama: '',
  ibuLahir: '',
  ibuAlamat: '',
  kerja: 'PNS',
  gaji: '',
  cicilan: '',
  riwayat: 'Lancar',
  slik: 'K1',
  lembaga: '0',
  hutangLain: '0',
  tunggakan: 'Tidak Ada',
  catatan: '',
}

const initialUiState: UiState = { isModalOpen: false, activeNasabahId: null, isDetailOpen: false, selectedNasabah: null }
const initialSubmitState: SubmitState = { isSubmitting: false, message: null, error: null }

export default function NasabahPage() {
  const [nasabahList, setNasabahList] = useState<Nasabah[]>([])
  const [form, setForm] = useState<NasabahForm>(initialForm)
  const [ui, setUi] = useState<UiState>(initialUiState)
  const [submitState, setSubmitState] = useState<SubmitState>(initialSubmitState)

  const {
    nama,
    nik,
    noRek,
    hp,
    email,
    lahir,
    alamat,
    ibuNama,
    ibuLahir,
    ibuAlamat,
    kerja,
    gaji,
    cicilan,
    riwayat,
    slik,
    lembaga,
    hutangLain,
    tunggakan,
    catatan,
  } = form

  const setFormField = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value } as NasabahForm))
  const setUiField = (field: string, value: any) => setUi((prev) => ({ ...prev, [field]: value }))
  const { isModalOpen, activeNasabahId, isDetailOpen, selectedNasabah } = ui

  const isNikValid = nik.length === 16 && /^[0-9]+$/.test(nik)
  const isFormValid =
    nama.trim() !== '' &&
    isNikValid &&
    noRek.trim() !== '' &&
    hp.trim() !== '' &&
    email.trim() !== '' &&
    lahir !== '' &&
    alamat.trim() !== '' &&
    ibuNama.trim() !== '' &&
    ibuLahir !== '' &&
    ibuAlamat.trim() !== '' &&
    Number(gaji) > 0 &&
    Number(cicilan) >= 0 &&
    Number(lembaga) >= 0 &&
    Number(hutangLain) >= 0

  useEffect(() => {
    const loadNasabah = async () => {
      try {
        const data = await api.getNasabah()
        if (Array.isArray(data)) {
          const mappedData = data.map((item: any) => ({
            id: String(item.id ?? crypto.randomUUID()),
            nama: item.nama ?? 'Nama belum tersedia',
            nik: item.nik ?? '',
            noRek: item.noRek ?? item.rekening ?? '-',
            hp: item.hp ?? item.noHp ?? '-',
            email: item.email ?? '-',
            lahir: item.lahir ?? '-',
            alamat: item.alamat ?? '-',
            ibu: {
              nama: item.ibu?.nama ?? item.ibuNama ?? '-',
              lahir: item.ibu?.lahir ?? item.ibuLahir ?? '-',
              alamat: item.ibu?.alamat ?? item.ibuAlamat ?? '-',
            },
            kerja: item.pekerjaan ?? item.kerja ?? 'Lainnya',
            gaji: Number(item.penghasilan ?? item.gaji ?? 0),
            cicilan: Number(item.cicilan ?? item.cicilanBulanan ?? 0),
            riwayat: item.riwayatPembayaran === 'telat' ? 'Telat' : 'Lancar',
            slik: item.slik ?? 'K1',
            hutangLain: Number(item.hutangLain ?? item.totalHutangLain ?? 0),
            lembaga: Number(item.lembaga ?? item.jumlahLembaga ?? 0),
            tunggakan: Boolean(item.tunggakan ?? item.adaTunggakan ?? false),
            catatan: item.catatan ?? item.keterangan ?? '',
            rasio: Number(item.rasio ?? (Number(item.cicilan ?? item.cicilanBulanan ?? 0) > 0 && Number(item.penghasilan ?? item.gaji ?? 0) > 0 ? (Number(item.cicilan ?? item.cicilanBulanan ?? 0) / Number(item.penghasilan ?? item.gaji ?? 0)) * 100 : 0)),
            risiko: item.risiko ?? 'Rendah',
          })) as Nasabah[]

          setNasabahList(mappedData)
        }
      } catch (error) {
        console.error('Gagal memuat data nasabah', error)
      }
    }

    loadNasabah()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isFormValid) return

    setSubmitState({ isSubmitting: true, message: null, error: null })

    const payload = {
      nama: nama.trim(),
      nik,
      noRek,
      hp,
      email,
      lahir,
      alamat,
      ibu: { nama: ibuNama, lahir: ibuLahir, alamat: ibuAlamat },
      kerja,
      gaji: Number(gaji),
      cicilan: Number(cicilan),
      riwayat,
      slik,
      hutangLain: Number(hutangLain),
      lembaga: Number(lembaga),
      tunggakan: tunggakan === 'Ada Tunggakan',
      catatan: catatan.trim() || undefined,
    }

    try {
      const created = await api.createNasabah(payload)
      const savedNasabah = (created && typeof created === 'object' && 'id' in created
        ? (created as Partial<Nasabah>)
        : null) ?? {
        id: crypto.randomUUID(),
      }

      const newNasabah: Nasabah = {
        id: String(savedNasabah.id ?? crypto.randomUUID()),
        nama: payload.nama,
        nik: payload.nik,
        noRek: payload.noRek,
        hp: payload.hp,
        email: payload.email,
        lahir: payload.lahir,
        alamat: payload.alamat,
        ibu: payload.ibu,
        kerja: payload.kerja,
        gaji: payload.gaji,
        cicilan: payload.cicilan,
        riwayat: payload.riwayat,
        slik: payload.slik,
        hutangLain: payload.hutangLain,
        lembaga: payload.lembaga,
        tunggakan: payload.tunggakan,
        catatan: payload.catatan,
      }

      setNasabahList((current) => [newNasabah, ...current])
      setForm({ ...initialForm })
      setSubmitState({ isSubmitting: false, message: 'Data nasabah berhasil disimpan.', error: null })
    } catch (error) {
      console.error('Gagal menyimpan data nasabah', error)
      const errorMessage = error instanceof Error ? error.message : 'Gagal menyimpan data nasabah.'
      setSubmitState({ isSubmitting: false, message: null, error: errorMessage })
    }
  }

  const rows = useMemo(
    () =>
      nasabahList.map((item) => {
        const rasio = item.gaji > 0 ? (item.cicilan / item.gaji) * 100 : 0
        const rounded = Number(rasio.toFixed(1))
        const status = item.slik
        const isHighBi = status === 'K3' || status === 'K4' || status === 'K5'
        const risiko = isHighBi
          ? 'Tinggi'
          : status === 'K2'
            ? rounded > 30
              ? 'Tinggi'
              : 'Sedang'
            : status === 'K1'
              ? rounded <= 30
                ? 'Rendah'
                : rounded <= 50
                  ? 'Sedang'
                  : 'Tinggi'
              : 'Tinggi'

        const biStatusLabel =
          status === 'K1'
            ? 'K1 Lancar'
            : status === 'K2'
              ? 'K2 DPK'
              : status === 'K3'
                ? 'K3 Kurang Lancar'
                : status === 'K4'
                  ? 'K4 Diragukan'
                  : 'K5 Macet'

        const biBadgeClass =
          status === 'K1'
            ? 'bg-emerald-400 text-slate-950'
            : status === 'K2'
              ? 'bg-amber-400 text-slate-950'
              : status === 'K3'
                ? 'bg-orange-500 text-slate-950'
                : status === 'K4'
                  ? 'bg-rose-500 text-slate-950'
                  : 'bg-rose-900 text-slate-100'

        return { ...item, rasio: rounded, risiko, biStatusLabel, biBadgeClass }
      }),
    [nasabahList],
  )

  const activeNasabah = selectedNasabah ?? (activeNasabahId ? rows.find((row) => row.id === activeNasabahId) || null : null)
  const showDetail = isModalOpen && isDetailOpen && !!activeNasabah

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-3xl border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-400">Data Nasabah</p>
          <h1 className="mt-3 text-xl font-semibold text-slate-100">Data Nasabah</h1>
          <p className="mt-2 text-xs text-slate-400">Tambah atau lihat data nasabah di sini.</p>
        </header>

        <section className="grid gap-3 xl:grid-cols-[420px_1fr]">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-700 bg-slate-800 p-4">
            <div className="rounded-3xl border border-slate-700 bg-slate-800/50 p-4">
              <div className="mb-4 border-b border-slate-700/50 pb-3">
                <p className="text-sm font-semibold text-slate-100">Data Pribadi</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Nama Lengkap</label>
                  <input
                    value={nama}
                    onChange={(event) => setFormField('nama', event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">NIK</label>
                  <input
                    value={nik}
                    onChange={(event) => setFormField('nik', event.target.value)}
                    maxLength={16}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="16 digit NIK"
                    inputMode="numeric"
                    pattern="[0-9]{16}"
                    required
                  />
                  {!isNikValid && nik.length > 0 ? <p className="text-sm text-rose-400">NIK harus berisi 16 angka.</p> : null}
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">No. Rekening</label>
                  <input
                    value={noRek}
                    onChange={(event) => setFormField('noRek', event.target.value)}
                    type="text"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="Contoh: 1234567890"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">No. HP</label>
                  <input
                    value={hp}
                    onChange={(event) => setFormField('hp', event.target.value)}
                    type="tel"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="Contoh: 081234567890"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Email</label>
                  <input
                    value={email}
                    onChange={(event) => setFormField('email', event.target.value)}
                    type="email"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="Contoh: email@domain.com"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Tanggal Lahir</label>
                  <input
                    value={lahir}
                    onChange={(event) => setFormField('lahir', event.target.value)}
                    type="date"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3 mt-3">
                <label className="block text-xs font-medium text-slate-200">Alamat</label>
                <textarea
                  value={alamat}
                  onChange={(event) => setFormField('alamat', event.target.value)}
                  rows={2}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  placeholder="Alamat lengkap nasabah"
                  required
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-800/50 p-4">
              <div className="mb-4 border-b border-slate-700/50 pb-3">
                <p className="text-sm font-semibold text-slate-100">Data Ibu Kandung</p>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-200">Nama Ibu Kandung</label>
                <input
                  value={ibuNama}
                  onChange={(event) => setFormField('ibuNama', event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  placeholder="Nama ibu kandung"
                  required
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2 mt-3">
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Tanggal Lahir Ibu Kandung</label>
                  <input
                    value={ibuLahir}
                    onChange={(event) => setFormField('ibuLahir', event.target.value)}
                    type="date"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Alamat Ibu Kandung</label>
                  <textarea
                    value={ibuAlamat}
                    onChange={(event) => setFormField('ibuAlamat', event.target.value)}
                    rows={2}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="Alamat ibu kandung"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-800/50 p-4">
              <div className="mb-4 border-b border-slate-700/50 pb-3">
                <p className="text-sm font-semibold text-slate-100">Data Pekerjaan & Keuangan</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Pekerjaan</label>
                  <select
                    value={kerja}
                    onChange={(event) => setFormField('kerja', event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  >
                    {pekerjaanOptions.map((option) => (
                      <option key={option} value={option} className="bg-slate-900 text-slate-100">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Penghasilan per bulan</label>
                  <input
                    value={gaji}
                    onChange={(event) => setFormField('gaji', event.target.value)}
                    type="number"
                    min="0"
                    step="10000"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="Contoh: 5000000"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 mt-3">
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Cicilan per bulan</label>
                  <input
                    value={cicilan}
                    onChange={(event) => setFormField('cicilan', event.target.value)}
                    type="number"
                    min="0"
                    step="10000"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="Contoh: 1500000"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Riwayat</label>
                  <select
                    value={riwayat}
                    onChange={(event) => setFormField('riwayat', event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  >
                    {riwayatOptions.map((option) => (
                      <option key={option} value={option} className="bg-slate-900 text-slate-100">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-800/50 p-4">
              <div className="mb-4 border-b border-slate-700/50 pb-3">
                <p className="text-sm font-semibold text-slate-100">BI Checking</p>
              </div>
              <p className="mb-4 text-xs text-slate-300">
                ?? BI Checking itu catatan hutang si nasabah di tempat lain. K1 paling bagus, K5 paling buruk.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Status SLIK</label>
                  <select
                    value={slik}
                    onChange={(event) => setFormField('slik', event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  >
                    <option value="K1">K1 - Lancar</option>
                    <option value="K2">K2 - Dalam Perhatian Khusus</option>
                    <option value="K3">K3 - Kurang Lancar</option>
                    <option value="K4">K4 - Diragukan</option>
                    <option value="K5">K5 - Macet</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Jumlah Lembaga</label>
                  <input
                    value={lembaga}
                    onChange={(event) => setFormField('lembaga', event.target.value)}
                    type="number"
                    min="0"
                    step="1"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="Jumlah lembaga kredit"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 mt-3">
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Total Hutang di Lembaga Lain</label>
                  <input
                    value={hutangLain}
                    onChange={(event) => setFormField('hutangLain', event.target.value)}
                    type="number"
                    min="0"
                    step="10000"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="Contoh: 2500000"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-200">Ada Tunggakan di Lembaga Lain?</label>
                  <select
                    value={tunggakan}
                    onChange={(event) => setFormField('tunggakan', event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  >
                    <option value="Tidak Ada">Tidak Ada</option>
                    <option value="Ada Tunggakan">Ada Tunggakan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 mt-3">
                <label className="block text-xs font-medium text-slate-200">Catatan BI Checking</label>
                <textarea
                  value={catatan}
                  onChange={(event) => setFormField('catatan', event.target.value)}
                  rows={2}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  placeholder="Keterangan tambahan (opsional)"
                />
              </div>
            </div>

            {submitState.error ? <p className="text-sm text-rose-400">{submitState.error}</p> : null}
            {submitState.message ? <p className="text-sm text-emerald-400">{submitState.message}</p> : null}
            <button
              type="submit"
              disabled={!isFormValid || submitState.isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitState.isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </form>

          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-4">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-sky-400">Daftar Nasabah</p>
                <h2 className="mt-2 text-sm font-semibold text-slate-100">Rekap data nasabah</h2>
              </div>
              <span className="rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-300">Total {nasabahList.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left text-xs text-slate-100">
                <thead className="bg-slate-900 text-slate-300">
                  <tr>
                    <th className="border-b border-slate-700 px-3 py-2">Nama</th>
                    <th className="border-b border-slate-700 px-3 py-2">NIK</th>
                    <th className="border-b border-slate-700 px-3 py-2">No. HP</th>
                    <th className="border-b border-slate-700 px-3 py-2">No. Rekening</th>
                    <th className="border-b border-slate-700 px-3 py-2">Pekerjaan</th>
                    <th className="border-b border-slate-700 px-3 py-2">Penghasilan</th>
                    <th className="border-b border-slate-700 px-3 py-2">Rasio Cicilan</th>
                    <th className="border-b border-slate-700 px-3 py-2">Riwayat</th>
                    <th className="border-b border-slate-700 px-3 py-2">BI Checking</th>
                    <th className="border-b border-slate-700 px-3 py-2">Risiko</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                        Data nasabah belum ditambahkan.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => {
                      const progress = Math.min(100, Math.max(0, row.rasio))
                      const risikoColor =
                        row.risiko === 'Rendah'
                          ? 'bg-emerald-500'
                          : row.risiko === 'Sedang'
                            ? 'bg-amber-400'
                            : 'bg-rose-500'

                      return (
                        <tr
                          key={row.id}
                          onClick={() => {
                            setUiField('activeNasabahId', row.id)
                            setUiField('isDetailOpen', true)
                            setUiField('selectedNasabah', row)
                            setUiField('isModalOpen', true)
                          }}
                          className="border-b border-slate-700 last:border-b-0 cursor-pointer hover:bg-slate-900"
                        >
                          <td className="px-3 py-2 font-medium text-slate-100">{row.nama}</td>
                          <td className="px-3 py-2 text-slate-300">{row.nik}</td>
                          <td className="px-3 py-2 text-slate-300">{row.hp}</td>
                          <td className="px-3 py-2 text-slate-300">{row.noRek}</td>
                          <td className="px-3 py-2 text-slate-300">{row.kerja}</td>
                          <td className="px-3 py-2 text-slate-300">{currencyFormatter.format(row.gaji)}</td>
                          <td className="px-3 py-2">
                            <div className="mb-2 text-xs text-slate-400">{row.rasio}%</div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                              <div className={`h-full rounded-full ${risikoColor}`} style={{ width: `${progress}%` }} />
                            </div>
                          </td>
                          <td className="px-3 py-2 text-slate-300">{row.riwayat}</td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${row.biBadgeClass}`}>
                              {row.biStatusLabel}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-slate-950 ${row.risiko === 'Rendah'
                                  ? 'bg-emerald-400'
                                  : row.risiko === 'Sedang'
                                    ? 'bg-amber-300'
                                    : 'bg-rose-400'
                                }`}
                            >
                              {row.risiko}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showDetail && activeNasabah ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-10">
              <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">Detail Nasabah</h2>
                    <p className="mt-1 text-xs text-slate-400">{activeNasabah.nama}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUiField('activeNasabahId', null)
                      setUiField('isDetailOpen', false)
                      setUiField('selectedNasabah', null)
                      setUiField('isModalOpen', false)
                    }}
                    className="rounded-2xl bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:bg-slate-600"
                  >
                    Tutup
                  </button>
                </div>
                <div className="grid gap-4 p-4 text-slate-100 md:grid-cols-2">
                  <div className="space-y-4 rounded-3xl border border-slate-700 bg-slate-900 p-4">
                    <p className="text-sm font-semibold text-slate-100">Data Pribadi</p>
                    <div className="grid gap-2 text-sm text-slate-300">
                      <p>Nama: {activeNasabah.nama}</p>
                      <p>NIK: {activeNasabah.nik}</p>
                      <p>Email: {activeNasabah.email}</p>
                      <p>No. HP: {activeNasabah.hp}</p>
                      <p>No. Rekening: {activeNasabah.noRek}</p>
                      <p>Tanggal Lahir: {activeNasabah.lahir}</p>
                      <p>Alamat: {activeNasabah.alamat}</p>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-3xl border border-slate-700 bg-slate-900 p-4">
                    <p className="text-sm font-semibold text-slate-100">Data Ibu Kandung</p>
                    <div className="grid gap-2 text-sm text-slate-300">
                      <p>Nama Ibu: {activeNasabah.ibu.nama}</p>
                      <p>Tanggal Lahir Ibu: {activeNasabah.ibu.lahir}</p>
                      <p>Alamat Ibu: {activeNasabah.ibu.alamat}</p>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-3xl border border-slate-700 bg-slate-900 p-4">
                    <p className="text-sm font-semibold text-slate-100">Pekerjaan & Keuangan</p>
                    <div className="grid gap-2 text-sm text-slate-300">
                      <p>Pekerjaan: {activeNasabah.kerja}</p>
                      <p>Penghasilan: {currencyFormatter.format(activeNasabah.gaji)}</p>
                      <p>Cicilan: {currencyFormatter.format(activeNasabah.cicilan)}</p>
                      <p>Riwayat Pembayaran: {activeNasabah.riwayat}</p>
                      <p>Rasio Cicilan: {activeNasabah.rasio}%</p>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-3xl border border-slate-700 bg-slate-900 p-4">
                    <p className="text-sm font-semibold text-slate-100">BI Checking</p>
                    <div className="grid gap-2 text-sm text-slate-300">
                      <p>Status SLIK: {activeNasabah.slik}</p>
                      <p>Jumlah Lembaga: {activeNasabah.lembaga}</p>
                      <p>Total Hutang Lain: {currencyFormatter.format(activeNasabah.hutangLain)}</p>
                      <p>Tunggakan: {activeNasabah.tunggakan ? 'Ada Tunggakan' : 'Tidak Ada'}</p>
                      <p>Catatan: {activeNasabah.catatan || 'Tidak ada catatan tambahan.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
