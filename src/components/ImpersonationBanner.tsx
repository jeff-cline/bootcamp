'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { TIER_LABEL } from '@/lib/roles'

// Fixed top banner shown to a GOD while "viewing as" another user. Exit
// clears the impersonation state on the server, mirrors it into the JWT via
// useSession().update(), then reloads so every server component (dashboard,
// admin guards, etc.) re-renders with the real role.
export default function ImpersonationBanner() {
  const { data: session, update } = useSession()
  const [exiting, setExiting] = useState(false)

  if (!session?.impersonating) return null

  const { email, role } = session.impersonating

  async function handleExit() {
    setExiting(true)
    await fetch('/api/admin/impersonate', { method: 'DELETE' })
    await update({ impersonating: null })
    // Hard navigation: router.push()/refresh() alone doesn't reliably
    // re-run the server components that depend on the session (see the
    // change-password fix for the same App Router quirk). A full reload
    // guarantees the banner and every gated page reflect the real role.
    window.location.assign('/dashboard')
  }

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-[#E8A849] to-[#e07800] text-white text-sm font-bold px-4 py-2.5 flex items-center justify-center gap-3 shadow-md">
        <span>
          Viewing as {email} ({TIER_LABEL[role]}) —
        </span>
        <button
          type="button"
          onClick={handleExit}
          disabled={exiting}
          className="underline underline-offset-2 hover:no-underline disabled:opacity-60"
        >
          {exiting ? 'Exiting…' : 'Exit'}
        </button>
      </div>
      {/* Spacer so fixed-position banner doesn't cover page content. */}
      <div className="h-10" aria-hidden="true" />
    </>
  )
}
