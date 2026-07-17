import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { embedUrl } from '@/lib/youtube'

function fmt(d: Date) {
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' })
}

export default async function VideosPage() {
  // (member) layout already redirects unauthenticated users to /login —
  // this check is defense in depth, matching the dashboard page's pattern.
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  const videos = await prisma.video.findMany({ orderBy: { publishedAt: 'desc' } })
  const liveVideo = videos.find((v) => v.isLive)
  const gridVideos = liveVideo ? videos.filter((v) => v.id !== liveVideo.id) : videos

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#34c5c5]/10 via-[#F6F8FA] to-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="text-sm font-bold text-[#0D9488] hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-4 mb-2">Video Vault</h1>
        <p className="text-gray-600 mb-10">{videos.length} video{videos.length === 1 ? '' : 's'}.</p>

        {liveVideo && (
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              ● Live now
            </div>
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <iframe
                className="w-full h-full"
                src={embedUrl(liveVideo.youtubeId)}
                title={liveVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h2 className="text-xl font-black text-gray-900 mt-4">{liveVideo.title}</h2>
            {liveVideo.description && <p className="text-gray-600 mt-1">{liveVideo.description}</p>}
          </div>
        )}

        {gridVideos.length === 0 && !liveVideo && (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center text-gray-500">
            No videos yet — check back soon.
          </div>
        )}

        {gridVideos.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={embedUrl(video.youtubeId)}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-black text-gray-900 mb-1">{video.title}</h3>
                  {video.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{video.description}</p>
                  )}
                  <p className="text-gray-400 text-xs">{fmt(video.publishedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
