// Extracts an 11-character YouTube video id from any common URL form, or
// accepts a raw id directly. Returns null when nothing valid is found so
// callers (the admin video API) can reject unparseable input.

const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/
const PATH_ID_PATTERN = /^\/(?:embed|live|shorts)\/([A-Za-z0-9_-]{11})/

export function parseYouTubeId(input: string): string | null {
  const trimmed = input?.trim()
  if (!trimmed) return null

  // Raw 11-char id, no URL involved.
  if (ID_PATTERN.test(trimmed)) return trimmed

  // Normalize so URL() can parse inputs missing a protocol
  // (e.g. "www.youtube.com/watch?v=...").
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  let url: URL
  try {
    url = new URL(withProtocol)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\.|^m\./i, '')
  if (host !== 'youtube.com' && host !== 'youtu.be') return null

  // youtu.be/<id>
  if (host === 'youtu.be') {
    const id = url.pathname.slice(1).split('/')[0]
    return ID_PATTERN.test(id) ? id : null
  }

  // youtube.com/watch?v=<id>
  if (/^\/watch\/?$/.test(url.pathname)) {
    const id = url.searchParams.get('v')
    return id && ID_PATTERN.test(id) ? id : null
  }

  // youtube.com/embed/<id>, /live/<id>, /shorts/<id>
  const match = url.pathname.match(PATH_ID_PATTERN)
  return match ? match[1] : null
}

export function embedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}`
}
