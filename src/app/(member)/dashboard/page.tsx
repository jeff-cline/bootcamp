import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { TIER_LABEL } from '@/lib/roles'
import { effectiveRole } from '@/lib/impersonation'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) redirect('/login')

  const videoCount = await prisma.video.count()

  // Uses the impersonated role when a GOD is "viewing as" someone else, so
  // the tier badge reflects what they're currently previewing.
  const role = effectiveRole(session) ?? 'EXECUTIVE'
  const displayName = user.name || user.email

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#34c5c5]/10 via-[#F6F8FA] to-white px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#34c5c5]/15 text-[#0D9488] rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-5">
          {TIER_LABEL[role]} Member
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">Welcome back, {displayName}.</h1>
        <p className="text-gray-600 mb-10">Your Beyond Limits Bootcamp member dashboard.</p>

        <div className="grid sm:grid-cols-2 gap-6">
          <Link
            href="/dashboard/videos"
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#34c5c5]/40 transition-shadow"
          >
            <h2 className="text-lg font-black text-gray-800 mb-2">Your Videos</h2>
            <p className="text-gray-600 text-sm">
              {videoCount} video{videoCount === 1 ? '' : 's'} in the vault →
            </p>
          </Link>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-2">Community</h2>
            <p className="text-gray-600 text-sm">Coming soon.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
