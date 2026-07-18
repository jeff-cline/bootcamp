import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { getVault } from '@/lib/vault'
import VaultBrowser from '@/components/VaultBrowser'

export default async function VideosPage() {
  // (member) layout already redirects unauthenticated users to /login —
  // this check is defense in depth, matching the dashboard page's pattern.
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  // Read Krystalore's published, themed library live (see src/lib/vault.ts).
  const { categories, videos } = await getVault()

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#34c5c5]/10 via-[#F6F8FA] to-white px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-sm font-bold text-[#0D9488] hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 mt-4 mb-2">Video Vault</h1>
        <p className="text-gray-600 mb-10">
          {videos.length} session{videos.length === 1 ? '' : 's'} across {categories.length} categor
          {categories.length === 1 ? 'y' : 'ies'}.
        </p>

        {videos.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center text-gray-500">
            The vault is warming up — check back soon.
          </div>
        ) : (
          <VaultBrowser categories={categories} videos={videos} />
        )}
      </div>
    </main>
  )
}
