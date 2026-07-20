export default function AnalisisPage() {
  const rows = [
    { nama: 'Budi Santoso', penghasilan: 'Rp 6.500.000', cicilan: 'Rp 1.500.000', rasio: '23%', risiko: 'Rendah' },
    { nama: 'Siti Aisyah', penghasilan: 'Rp 4.200.000', cicilan: 'Rp 1.450.000', rasio: '35%', risiko: 'Sedang' },
    { nama: 'Agus Pratama', penghasilan: 'Rp 8.000.000', cicilan: 'Rp 4.400.000', rasio: '55%', risiko: 'Tinggi' },
    { nama: 'Dewi Lestari', penghasilan: 'Rp 5.700.000', cicilan: 'Rp 1.300.000', rasio: '23%', risiko: 'Rendah' },
    { nama: 'Rian Pratama', penghasilan: 'Rp 3.800.000', cicilan: 'Rp 1.450.000', rasio: '38%', risiko: 'Sedang' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-3xl border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Analisis Risiko</p>
          <h1 className="mt-3 text-xl font-semibold text-slate-100">Analisis Risiko</h1>
          <p className="mt-3 max-w-2xl text-xs text-slate-400">Lihat kondisi risiko pinjaman nasabah.</p>
        </header>

        <section className="grid gap-3 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-sm font-semibold text-slate-400">Risiko Rendah</p>
            <p className="mt-4 text-lg font-bold text-emerald-400">45 nasabah</p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-sm font-semibold text-slate-400">Risiko Sedang</p>
            <p className="mt-4 text-lg font-bold text-amber-300">28 nasabah</p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-sm font-semibold text-slate-400">Risiko Tinggi</p>
            <p className="mt-4 text-lg font-bold text-rose-400">12 nasabah</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-800 p-4">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Sebaran Risiko</p>
              <h2 className="mt-3 text-sm font-semibold text-slate-100">Komposisi risiko nasabah</h2>
            </div>
            <div className="space-y-2 text-right text-slate-300">
              <p className="text-sm">Rendah 53%</p>
              <p className="text-sm">Sedang 33%</p>
              <p className="text-sm">Tinggi 14%</p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-1">
            <div className="flex h-10 overflow-hidden rounded-3xl bg-slate-700">
              <div className="h-full bg-emerald-400" style={{ width: '53%' }} />
              <div className="h-full bg-amber-300" style={{ width: '33%' }} />
              <div className="h-full bg-rose-400" style={{ width: '14%' }} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-800 p-4">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Daftar Nasabah</p>
            <h2 className="mt-3 text-sm font-semibold text-slate-100">Detail nasabah berdasarkan risiko</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-xs text-slate-100">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="border-b border-slate-700 px-3 py-2">Nama</th>
                  <th className="border-b border-slate-700 px-3 py-2">Penghasilan</th>
                  <th className="border-b border-slate-700 px-3 py-2">Cicilan</th>
                  <th className="border-b border-slate-700 px-3 py-2">Rasio %</th>
                  <th className="border-b border-slate-700 px-3 py-2">Risiko</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const badgeClasses =
                    row.risiko === 'Rendah'
                      ? 'bg-emerald-400 text-slate-950'
                      : row.risiko === 'Sedang'
                      ? 'bg-amber-300 text-slate-950'
                      : 'bg-rose-400 text-slate-950'

                  return (
                    <tr key={row.nama} className="border-b border-slate-700 last:border-b-0">
                      <td className="px-3 py-2 font-medium text-slate-100">{row.nama}</td>
                      <td className="px-3 py-2 text-slate-300">{row.penghasilan}</td>
                      <td className="px-3 py-2 text-slate-300">{row.cicilan}</td>
                      <td className="px-3 py-2 text-slate-300">{row.rasio}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses}`}>
                          {row.risiko}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
