// The Beyond Limits vault reads Krystalore's published, themed video library
// LIVE from krystalore.com's keyed feed (app/api/vault-feed on that site) — so
// anything Krystalore publishes (including Go-Live replays) shows up here
// automatically, with nothing duplicated. Fetched server-side only; the key
// never reaches the browser.

export type VaultVideo = {
  id: string
  title: string
  description: string | null
  category: string
  fileUrl: string | null
  muxPlaybackId: string | null
  thumbnailUrl: string | null
  duration: number | null
  createdAt: string
}

export type VaultCategory = { name: string; count: number }

export type VaultData = { categories: VaultCategory[]; videos: VaultVideo[] }

export async function getVault(): Promise<VaultData> {
  const url = process.env.KRYSTALORE_VAULT_URL
  const key = process.env.KRYSTALORE_VAULT_KEY
  if (!url || !key) return { categories: [], videos: [] }

  try {
    const res = await fetch(url, {
      headers: { 'x-vault-key': key },
      // Cache the catalog for 5 min so we don't hammer krystalore.com on every
      // page view; new publishes appear within the window.
      next: { revalidate: 300 },
    })
    if (!res.ok) return { categories: [], videos: [] }
    const data = (await res.json()) as VaultData
    return { categories: data.categories ?? [], videos: data.videos ?? [] }
  } catch {
    return { categories: [], videos: [] }
  }
}
