import { describe, it, expect } from 'vitest'
import { parseYouTubeId, embedUrl } from '@/lib/youtube'

describe('parseYouTubeId', () => {
  it('extracts from watch?v= URLs', () => {
    expect(parseYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts from watch?v= URLs with extra query params', () => {
    expect(parseYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s&list=PL123')).toBe(
      'dQw4w9WgXcQ'
    )
  })

  it('extracts from youtu.be short URLs', () => {
    expect(parseYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts from youtu.be short URLs with query params', () => {
    expect(parseYouTubeId('https://youtu.be/dQw4w9WgXcQ?t=10')).toBe('dQw4w9WgXcQ')
  })

  it('extracts from /live/ URLs', () => {
    expect(parseYouTubeId('https://www.youtube.com/live/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts from /live/ URLs with query params', () => {
    expect(parseYouTubeId('https://www.youtube.com/live/dQw4w9WgXcQ?feature=share')).toBe(
      'dQw4w9WgXcQ'
    )
  })

  it('extracts from /embed/ URLs', () => {
    expect(parseYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts from /shorts/ URLs', () => {
    expect(parseYouTubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('accepts a raw 11-char id', () => {
    expect(parseYouTubeId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('trims whitespace around a raw id', () => {
    expect(parseYouTubeId('  dQw4w9WgXcQ  ')).toBe('dQw4w9WgXcQ')
  })

  it('handles URLs without protocol', () => {
    expect(parseYouTubeId('www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('handles bare m.youtube.com URLs', () => {
    expect(parseYouTubeId('https://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('returns null for an invalid URL', () => {
    expect(parseYouTubeId('https://example.com/not-a-video')).toBeNull()
  })

  it('returns null for garbage input', () => {
    expect(parseYouTubeId('not a url at all')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(parseYouTubeId('')).toBeNull()
  })

  it('returns null for an id that is too short', () => {
    expect(parseYouTubeId('short')).toBeNull()
  })

  it('returns null for a youtube URL missing the id', () => {
    expect(parseYouTubeId('https://www.youtube.com/watch')).toBeNull()
  })
})

describe('embedUrl', () => {
  it('builds a youtube embed URL from an id', () => {
    expect(embedUrl('dQw4w9WgXcQ')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
  })
})
