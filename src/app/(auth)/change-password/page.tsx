'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function ChangePasswordPage() {
  const { data: session, update } = useSession()

  const mustChangePassword = session?.mustChangePassword ?? false

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: mustChangePassword ? undefined : currentPassword,
          newPassword,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      // Refresh the JWT so mustChangePassword reflects the DB. We then do a
      // full page navigation rather than router.push(): in this app,
      // router.push() called right after a useSession().update() reliably
      // no-ops (the client transition never fires, confirmed by manual
      // browser testing — the middleware/session/cookie are correct at this
      // point, a full navigation lands on /dashboard immediately). A hard
      // navigation re-runs middleware against the now-updated session
      // cookie, so it can't bounce back to /change-password.
      await update()
      window.location.assign('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#34c5c5]/10 via-[#F6F8FA] to-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-800">
            {mustChangePassword ? 'Set a new password' : 'Change your password'}
          </h1>
          <p className="mt-2 text-gray-600">
            {mustChangePassword
              ? 'For security, you must set a new password before continuing.'
              : 'Enter your current password and a new password.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-5"
        >
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3">
              {error}
            </div>
          )}

          {!mustChangePassword && (
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-bold text-gray-700 mb-1.5">
                Current password
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-1.5">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
            />
            <p className="mt-1.5 text-xs text-gray-500">At least 10 characters.</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1.5">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E8A849] to-[#e07800] text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? 'Saving…' : 'Save new password'}
          </button>
        </form>
      </div>
    </main>
  )
}
