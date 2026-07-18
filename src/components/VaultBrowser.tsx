'use client'

import { useMemo, useState } from 'react'
import type { VaultVideo, VaultCategory } from '@/lib/vault'

function fmtDuration(seconds: number | null) {
  if (!seconds || seconds <= 0) return null
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function VideoCard({ video, onPlay }: { video: VaultVideo; onPlay: (v: VaultVideo) => void }) {
  const dur = fmtDuration(video.duration)
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group text-left bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-video bg-gradient-to-br from-[#34c5c5]/15 to-[#e07800]/10 flex items-center justify-center overflow-hidden">
        {video.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={video.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        <span className="relative z-10 w-12 h-12 rounded-full bg-white/90 shadow flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" className="w-5 h-5 ml-0.5 fill-[#e07800]"><path d="M8 5v14l11-7z" /></svg>
        </span>
        {dur && (
          <span className="absolute bottom-2 right-2 z-10 text-[11px] font-bold text-white bg-black/60 rounded px-1.5 py-0.5">{dur}</span>
        )}
      </div>
      <div className="p-4">
        <span className="inline-block text-[10px] uppercase font-bold tracking-wide text-[#0D9488] bg-[#34c5c5]/15 rounded-full px-2 py-0.5 mb-2">
          {video.category}
        </span>
        <h3 className="font-bold text-gray-800 leading-snug line-clamp-2">{video.title}</h3>
        {video.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>
        )}
      </div>
    </button>
  )
}

function PlayerModal({ video, onClose }: { video: VaultVideo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-black aspect-video">
          {video.muxPlaybackId ? (
            <video className="w-full h-full" src={`https://stream.mux.com/${video.muxPlaybackId}.m3u8`} controls autoPlay playsInline />
          ) : video.fileUrl ? (
            <video className="w-full h-full" src={video.fileUrl} controls autoPlay playsInline />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/70 text-sm">This video isn&apos;t available to stream.</div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block text-[10px] uppercase font-bold tracking-wide text-[#0D9488] bg-[#34c5c5]/15 rounded-full px-2 py-0.5 mb-2">
                {video.category}
              </span>
              <h2 className="text-xl font-black text-gray-800">{video.title}</h2>
              {video.description && <p className="text-gray-600 mt-1">{video.description}</p>}
            </div>
            <button type="button" onClick={onClose} className="shrink-0 text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VaultBrowser({
  categories,
  videos,
}: {
  categories: VaultCategory[]
  videos: VaultVideo[]
}) {
  const [selected, setSelected] = useState<string>('All')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<VaultVideo | null>(null)
  const [limit, setLimit] = useState(24)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return videos.filter((v) => {
      if (selected !== 'All' && v.category !== selected) return false
      if (q && !(`${v.title} ${v.description ?? ''}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [videos, selected, query])

  const shown = filtered.slice(0, limit)

  return (
    <div>
      {/* Search */}
      <div className="mb-5">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setLimit(24) }}
          placeholder="Search the vault…"
          className="w-full sm:max-w-sm rounded-full border border-gray-300 px-5 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ name: 'All', count: videos.length }, ...categories].map((c) => {
          const on = selected === c.name
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => { setSelected(c.name); setLimit(24) }}
              className={`text-sm font-bold rounded-full px-4 py-1.5 transition-colors ${
                on ? 'bg-gradient-to-r from-[#E8A849] to-[#e07800] text-white shadow' : 'bg-[#F4F1EC] text-gray-600 hover:bg-[#34c5c5]/15 hover:text-[#0D9488]'
              }`}
            >
              {c.name} <span className={on ? 'opacity-80' : 'text-gray-400'}>{c.count}</span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">No videos match.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map((v) => (
              <VideoCard key={v.id} video={v} onPlay={setActive} />
            ))}
          </div>
          {filtered.length > shown.length && (
            <div className="text-center mt-8">
              <button
                type="button"
                onClick={() => setLimit((n) => n + 24)}
                className="inline-flex items-center gap-2 bg-[#F4F1EC] text-[#0D9488] font-bold px-6 py-2.5 rounded-full hover:bg-[#34c5c5]/15 transition-colors"
              >
                Load more ({filtered.length - shown.length} more)
              </button>
            </div>
          )}
        </>
      )}

      {active && <PlayerModal video={active} onClose={() => setActive(null)} />}
    </div>
  )
}
