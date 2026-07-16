import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { isAdminRole } from '@/lib/roles'
import ImpersonationBanner from '@/components/ImpersonationBanner'

// Server-side guard for the whole /admin area, in addition to
// src/middleware.ts (defense in depth). Gates on the REAL role — an
// impersonated tier must never grant or restrict admin access.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.userId) redirect('/login')
  if (!isAdminRole(session.role)) redirect('/dashboard')

  return (
    <>
      <ImpersonationBanner />
      <div className="min-h-screen bg-[#F6F8FA]">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="font-black text-gray-900">Beyond Limits Admin</span>
              <nav className="flex items-center gap-4 text-sm font-bold text-gray-600">
                <Link href="/admin" className="hover:text-[#0D9488]">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="hover:text-[#0D9488]">
                  Users
                </Link>
              </nav>
            </div>
            <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-[#0D9488]">
              ← Member view
            </Link>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</main>
      </div>
    </>
  )
}
