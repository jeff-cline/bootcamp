'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { isAdminRole } from '@/lib/roles'

export default function MemberNav() {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-black text-gray-900">
          Beyond Limits Bootcamp
        </Link>
        <div className="flex items-center gap-4 text-sm font-bold">
          {session?.role && isAdminRole(session.role) && (
            <Link href="/admin" className="text-gray-600 hover:text-[#0D9488]">
              Admin
            </Link>
          )}
          {session?.user?.email && <span className="text-gray-400 hidden sm:inline">{session.user.email}</span>}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-gray-600 hover:text-[#0D9488]"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
