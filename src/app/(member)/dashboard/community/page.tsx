import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { getCommunity } from '@/lib/community'
import { CATEGORY_BY_KEY, categoryLabel } from '@/lib/categories'
import { earnedCount } from '@/lib/badges'
import CommunityComposer from '@/components/CommunityComposer'
import ReactionBar from '@/components/ReactionBar'

function fmt(d: string) {
  return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default async function CommunityPage() {
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  const { streak, longest, total, badges, feed } = await getCommunity(session.userId)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#34c5c5]/10 via-[#F6F8FA] to-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-sm font-bold text-[#0D9488] hover:underline">← Back to dashboard</Link>

        <div className="flex items-center justify-between mt-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#34c5c5]/15 text-[#0D9488] rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-3">
              Community · powered by HYghLights
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800">Celebrate the wins</h1>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-[#e07800]">🔥 {streak}</div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">day streak</p>
          </div>
        </div>

        {/* Stats + badges */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Stat label="Your HYghLights" value={total} />
          <Stat label="Best streak" value={longest} />
          <Stat label="Badges" value={earnedCount(badges)} />
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {badges.map((b) => (
            <span
              key={b.key}
              title={b.hint}
              className={`text-sm font-bold rounded-full px-3 py-1.5 border ${
                b.earned
                  ? 'bg-gradient-to-r from-[#E8A849]/15 to-[#e07800]/10 border-[#E8A849]/40 text-gray-800'
                  : 'bg-white border-gray-100 text-gray-300'
              }`}
            >
              <span className={b.earned ? '' : 'grayscale opacity-50'}>{b.emoji}</span> {b.label}
            </span>
          ))}
        </div>

        {/* Composer */}
        <CommunityComposer />

        {/* Feed */}
        <h3 className="text-gray-800 font-black mt-10 mb-3">The wins wall</h3>
        {feed.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 text-center text-gray-500">
            No HYghLights yet — be the first to share a win.
          </div>
        ) : (
          <div className="space-y-4">
            {feed.map((h) => {
              const c = CATEGORY_BY_KEY[h.category]
              return (
                <div key={h.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-black text-gray-800">{h.isMine ? 'You' : h.author}</span>
                    <span className="text-sm font-bold" style={{ color: c?.color ?? '#e07800' }}>
                      · {c?.emoji} {categoryLabel(h.category)}
                    </span>
                    <span className="text-gray-400 text-xs">· {fmt(h.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap mb-3">{h.text}</p>
                  <ReactionBar highlightId={h.id} counts={h.counts} mine={h.mine} endpoint="/api/community/reactions" />
                </div>
              )
            })}
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-8">
          Want the full ritual — the jar, groups, and recaps?{' '}
          <a href="https://hyghlights.com/home" target="_blank" rel="noopener noreferrer" className="text-[#0D9488] font-bold hover:underline">
            Open HYghLights →
          </a>
        </p>
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-center shadow-sm">
      <div className="text-2xl font-black text-gray-800">{value}</div>
      <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wide">{label}</p>
    </div>
  )
}
