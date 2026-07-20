const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://backend-simpan-pinjam-production.up.railway.app').replace(/\/$/, '')

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('sp_token')
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('sp_token', token)
  document.cookie = `sp_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
}

export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('sp_token')
  document.cookie = 'sp_token=; path=/; max-age=0'
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const contentType = res.headers.get('content-type') || ''
  const hasJsonBody = contentType.includes('application/json')
  const responseBody = hasJsonBody ? await res.json().catch(() => null) : await res.text().catch(() => null)

  if (!res.ok) {
    const errorMessage =
      (responseBody as any)?.message ||
      (responseBody as any)?.error ||
      `HTTP Error ${res.status}`
    throw new Error(errorMessage)
  }

  return responseBody
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // Nasabah
  getNasabah: () => apiFetch('/nasabah'),
  getNasabahById: (id: number) => apiFetch(`/nasabah/${id}`),
  createNasabah: (data: any) =>
    apiFetch('/nasabah', { method: 'POST', body: JSON.stringify(data) }),
  updateNasabah: (id: number, data: any) =>
    apiFetch(`/nasabah/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteNasabah: (id: number) => apiFetch(`/nasabah/${id}`, { method: 'DELETE' }),

  // Pinjaman
  getPinjaman: () => apiFetch('/pinjaman'),
  getPinjamanById: (id: number) => apiFetch(`/pinjaman/${id}`),
  createPinjaman: (data: any) =>
    apiFetch('/pinjaman', { method: 'POST', body: JSON.stringify(data) }),
  updatePinjaman: (id: number, data: any) =>
    apiFetch(`/pinjaman/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Pembayaran
  getPembayaran: () => apiFetch('/pembayaran'),
  getPembayaranByPinjaman: (pinjamanId: number) =>
    apiFetch(`/pembayaran/pinjaman/${pinjamanId}`),
  createPembayaran: (data: any) =>
    apiFetch('/pembayaran', { method: 'POST', body: JSON.stringify(data) }),

  // Simpanan
  getSimpanan: () => apiFetch('/simpanan'),
  getSimpananByNasabah: (nasabahId: number) =>
    apiFetch(`/simpanan/nasabah/${nasabahId}`),
  getSaldoNasabah: (nasabahId: number) =>
    apiFetch(`/simpanan/saldo/${nasabahId}`),

  // Analisis
  getAnalisisPekerjaan: () => apiFetch('/analisis-pekerjaan'),
  getAnalisisRisiko: () => apiFetch('/analisis-risiko'),
}
