import { prisma } from '@/lib/db'
import VideosTable from './VideosTable'

export default async function AdminVideosPage() {
  // Layout already guards GOD/ADMIN-only + redirects unauthenticated users.
  const videos = await prisma.video.findMany({ orderBy: { publishedAt: 'desc' } })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Video Vault</h1>
        <p className="text-gray-600 mt-1">Manage the videos members see on the dashboard.</p>
      </div>
      <VideosTable initialVideos={videos} />
    </div>
  )
}
