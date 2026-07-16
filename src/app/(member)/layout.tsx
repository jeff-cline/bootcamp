import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import ImpersonationBanner from '@/components/ImpersonationBanner'
import MemberNav from '@/components/layout/MemberNav'

// Server-side guard for the whole /dashboard area (middleware also covers
// this — defense in depth), plus the impersonation banner and member nav
// shared by every gated member page.
export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  return (
    <>
      <ImpersonationBanner />
      <MemberNav />
      {children}
    </>
  )
}
