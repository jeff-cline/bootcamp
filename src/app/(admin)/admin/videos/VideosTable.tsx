'use client'

import { useState } from 'react'
import { embedUrl } from '@/lib/youtube'

type AdminVideo = {
  id: string
  title: string
  description: string | null
  youtubeId: string
  isLive: boolean
  publishedAt: string | Date
  createdAt: string | Date
}

function fmt(d: string | Date) {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function VideosTable({ initialVideos }: { initialVideos: AdminVideo[] }) {
  const [videos, setVideos] = useState<AdminVideo[]>(initialVideos)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<AdminVideo | null>(null)

  async function refresh() {
    const res = await fetch('/api/admin/videos')
    if (res.ok) {
      const body = await res.json()
      setVideos(body.videos)
    }
  }

  async function handleToggleLive(video: AdminVideo) {
    setError(null)
    setBusyId(video.id)
    const res = await fetch(`/api/admin/videos/${video.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLive: !video.isLive }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(body.error ?? 'Could not update live status.')
    } else {
      await refresh()
    }
    setBusyId(null)
  }

  async function handleDelete(video: AdminVideo) {
    setError(null)
    setBusyId(video.id)
    const res = await fetch(`/api/admin/videos/${video.id}`, { method: 'DELETE' })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(body.error ?? 'Could not delete video.')
    } else {
      await refresh()
    }
    setBusyId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{videos.length} videos</p>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8A849] to-[#e07800] text-white font-bold px-5 py-2.5 rounded-full shadow hover:scale-[1.02] transition-transform text-sm"
        >
          + Add video
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3 font-bold">Title</th>
                <th className="text-left px-5 py-3 font-bold">YouTube ID</th>
                <th className="text-left px-5 py-3 font-bold">Published</th>
                <th className="text-left px-5 py-3 font-bold">Live</th>
                <th className="text-right px-5 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {videos.map((video) => (
                <tr key={video.id}>
                  <td className="px-5 py-3 font-semibold text-gray-900">{video.title}</td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">{video.youtubeId}</td>
                  <td className="px-5 py-3 text-gray-500">{fmt(video.publishedAt)}</td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      disabled={busyId === video.id}
                      onClick={() => handleToggleLive(video)}
                      className={`text-xs font-bold px-2 py-1 rounded-full disabled:opacity-50 ${
                        video.isLive ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {video.isLive ? '● Live now' : 'Set live'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        disabled={busyId === video.id}
                        onClick={() => setEditing(video)}
                        className="text-xs font-bold text-[#0D9488] hover:underline disabled:opacity-40"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === video.id}
                        onClick={() => handleDelete(video)}
                        className="text-xs font-bold text-gray-500 hover:text-red-600 disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                    No videos yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <VideoModal
          mode="create"
          onClose={() => setShowCreate(false)}
          onSaved={async () => {
            setShowCreate(false)
            await refresh()
          }}
        />
      )}

      {editing && (
        <VideoModal
          mode="edit"
          video={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null)
            await refresh()
          }}
        />
      )}
    </div>
  )
}

function VideoModal({
  mode,
  video,
  onClose,
  onSaved,
}: {
  mode: 'create' | 'edit'
  video?: AdminVideo
  onClose: () => void
  onSaved: () => void
}) {
  const [title, setTitle] = useState(video?.title ?? '')
  const [description, setDescription] = useState(video?.description ?? '')
  const [youtubeUrl, setYoutubeUrl] = useState(video ? embedUrl(video.youtubeId) : '')
  const [isLive, setIsLive] = useState(video?.isLive ?? false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const url = mode === 'create' ? '/api/admin/videos' : `/api/admin/videos/${video!.id}`
    const method = mode === 'create' ? 'POST' : 'PATCH'
    const body =
      mode === 'create'
        ? { title, description: description || undefined, youtubeUrl }
        : { title, description: description || undefined, youtubeUrl, isLive }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const resBody = await res.json().catch(() => ({}))
    setSubmitting(false)
    if (!res.ok) {
      setError(resBody.error ?? 'Could not save video.')
      return
    }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 w-full max-w-md">
        <h2 className="text-xl font-black text-gray-900 mb-1">
          {mode === 'create' ? 'Add video' : 'Edit video'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Paste any YouTube URL — watch, youtu.be, live, embed, or shorts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">YouTube URL</label>
            <input
              type="text"
              required
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
            />
          </div>

          {mode === 'edit' && (
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <input
                type="checkbox"
                checked={isLive}
                onChange={(e) => setIsLive(e.target.checked)}
                className="rounded border-gray-300"
              />
              Live now
            </label>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-sm font-bold text-gray-500 px-4 py-2.5">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8A849] to-[#e07800] text-white font-bold px-6 py-2.5 rounded-full shadow disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
