'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
              <Image
                src="/images/bootcamp/beyond-limits-bootcamp-logo.png"
                alt="Beyond Limits Bootcamp"
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
            <span className="font-black text-gray-900 text-sm md:text-base tracking-tight leading-tight">
              Beyond Limits<br className="hidden sm:block" /> Bootcamp
            </span>
          </Link>
          <nav className="flex items-center gap-3 md:gap-4">
            <Link
              href="/login"
              className="text-sm font-bold text-gray-700 hover:text-[#0D9488] transition-colors px-3 py-2"
            >
              Login
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#E8A849] to-[#e07800] text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-sm hover:scale-105 transition-transform"
            >
              Join
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
