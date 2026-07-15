'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import {
  ArrowRight, Check, X, Target, Sparkles, Award, Users, Shield,
  MapPin, Dumbbell, Brain, Heart, TrendingUp, Compass, Zap, Star,
} from 'lucide-react'

const CHECKOUT_URL = 'https://www.krystalorecrews.com/virtual-hiit-camp-checkout-page'

// Orange glow applied to section headings so they stand out against the light page
const GLOW = { textShadow: '0 0 2px #e07800, 0 0 9px rgba(224,120,0,0.75), 0 0 20px rgba(224,120,0,0.45)' }

const STRONG_IS = [
  'Strong is having energy at 3 PM.',
  'Strong is feeling confident in your clothes.',
  'Strong is keeping promises to yourself.',
  'Strong is leading your family, your business, and your life without sacrificing your health.',
]

const METHOD = [
  { min: '2', label: 'Intention', desc: 'Set the standard for the day before you move.' },
  { min: '30', label: 'Workout', desc: 'A complete session — warm-up and cool-down included.' },
  { min: '2', label: 'Reflection', desc: 'Reflect, celebrate the rep, and lock in the win.' },
]

const NO_LIST = ['No equipment', 'No fancy studio', 'No expensive gym', 'No fad diets', 'No extreme fitness culture']

const BELIEVE = [
  'Simplicity wins.',
  'Systems beat motivation.',
  'Consistency beats perfection.',
  'Strong habits create strong leaders.',
  'Health is your greatest competitive advantage.',
]

const DONT_BELIEVE = [
  'You need a gym membership.',
  'In fad diets.',
  'In spending two hours working out.',
  'You need fancy equipment.',
  'Motivation creates results.',
]

const BUILD = [
  { icon: Dumbbell, label: 'Lean muscle' },
  { icon: Shield, label: 'Functional strength' },
  { icon: Zap, label: 'Daily energy' },
  { icon: TrendingUp, label: 'Better posture' },
  { icon: Star, label: 'Improved confidence' },
  { icon: Compass, label: 'Sustainable habits' },
  { icon: Brain, label: 'Mental resilience' },
  { icon: Heart, label: 'Long-term vitality' },
]

const AUDIENCE = [
  'Entrepreneurs', 'Business owners', 'Executives', 'Professionals',
  'Former athletes', 'Veterans & first responders', 'Caregivers', 'Busy adults',
]

const FOR_LIST = [
  'Lead teams.',
  'Run businesses.',
  'Serve everyone else.',
  'Travel frequently.',
  'Used to be athletes and want to feel like themselves again.',
  'Know their health deserves a permanent place on the calendar.',
  'Value discipline over excuses.',
]

const NOT_FOR = [
  "You're looking for a magic pill.",
  'You want six-pack abs without changing your habits.',
  'You’re waiting until you’re “motivated.”',
  'You expect someone else to hold you accountable forever.',
  "You aren't willing to schedule 30 minutes for yourself.",
]

const COMPARE = [
  ['Long workouts', '30 minutes'],
  ['Gym required', 'Anywhere'],
  ['Expensive equipment', 'No equipment'],
  ['Fad diets', 'Sustainable nutrition habits'],
  ['Start over every Monday', 'Daily system'],
  ['Motivation', 'Discipline'],
  ['Temporary results', 'Lifelong lifestyle'],
]

const NMW = [
  ['We don’t chase motivation.', 'We create routines.'],
  ['We don’t start over every Monday.', 'We don’t quit after vacation.'],
  ['We don’t disappear during busy seasons.', 'We show up.'],
]

const CREDS = [
  '22-Year Retired SMSgt, U.S. Air Force',
  '28-Time Marathoner · 50-Mile Ultra Finisher',
  'Amazon Best-Selling Author',
  'Cancer Survivor',
  'Executive, Performance & Wellness Coach',
]

export default function BootcampPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* HERO */}
        <section id="top" className="relative overflow-hidden bg-gradient-to-b from-[#34c5c5]/10 via-[#F6F8FA] to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <div className="relative aspect-square w-[70%] -ml-2 mb-2">
                  <Image src="/images/bootcamp/beyond-limits-bootcamp-logo.png" alt="Beyond Limits Bootcamp" fill priority className="object-contain object-left" sizes="(max-width: 1024px) 70vw, 35vw" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.02] tracking-tight mb-6">
                  Train Like Your Life Depends on It.<br />
                  <span className="text-[#e07800]">Because It Does.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl">
                  The 30-Minute Performance System for high performers who refuse to put their health last.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E8A849] to-[#e07800] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform text-center">
                    Start Living Beyond Limits <ArrowRight className="h-5 w-5" />
                  </a>
                  <a href="#pricing" className="inline-flex items-center justify-center border-2 border-[#0D9488] text-[#0D9488] font-bold px-8 py-4 rounded-full hover:bg-[#0D9488]/5 transition-colors text-center">
                    Train With Us
                  </a>
                </div>
                <p className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#0D9488]">
                  <Sparkles className="h-4 w-4" /> Now enrolling · train from anywhere
                </p>
              </div>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl">
                <Image src="/images/bootcamp/krystalore-beach-ringlight.jpg" alt="Krystalore Crews coaching a live Beyond Limits Bootcamp session" fill priority className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </div>
          </div>
        </section>

        {/* STRONG ISN'T A LOOK */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 style={GLOW} className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-10">
              Strong isn&apos;t a look.
            </h2>
            <div className="space-y-4">
              {STRONG_IS.map((line) => (
                <p key={line} className="text-xl md:text-2xl text-gray-500 font-light leading-snug">{line}</p>
              ))}
            </div>
            <p className="mt-12 text-2xl md:text-3xl font-black text-[#e07800]">That&apos;s what we train.</p>
          </div>
        </section>

        {/* THE 34-MINUTE METHOD */}
        <section className="py-20 md:py-24 bg-[#F6F8FA]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[#0D9488] font-bold uppercase tracking-[0.2em] text-sm mb-3">The System</p>
              <h2 style={GLOW} className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">The 34-Minute Method</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">A complete 30-minute workout — warm-up and cool-down included — bookended by intention and celebration.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {METHOD.map(({ min, label, desc }, i) => (
                <div key={label} className="bg-white rounded-3xl p-8 shadow-sm text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E8A849]/15 to-[#e07800]/10">
                    <span className="text-2xl font-black text-[#e07800]">{min}<span className="text-sm">min</span></span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{label}</h3>
                  <p className="text-gray-500">{desc}</p>
                  {i === 0 && <p className="sr-only">Step one</p>}
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {NO_LIST.map((n) => (
                <span key={n} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                  <X className="h-4 w-4 text-[#e07800]" /> {n}
                </span>
              ))}
            </div>
            <p className="mt-8 text-center text-lg text-gray-700 font-semibold">
              <MapPin className="inline h-5 w-5 text-[#0D9488] mr-1" />
              Train anywhere — home, hotel, office, beach, cruise ship, or while traveling.
            </p>
          </div>
        </section>

        {/* WHAT WE BELIEVE / DON'T BELIEVE */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-3xl bg-[#F4F1EC] p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">What We Believe</h2>
                <ul className="space-y-4">
                  {BELIEVE.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-lg text-gray-800 font-medium">
                      <Check className="h-6 w-6 flex-shrink-0 text-[#0D9488] mt-0.5" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-gray-50 border border-gray-100 p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">What We Don&apos;t Believe</h2>
                <ul className="space-y-4">
                  {DONT_BELIEVE.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-lg text-gray-500">
                      <X className="h-6 w-6 flex-shrink-0 text-[#e07800] mt-0.5" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-12 text-center max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl font-light text-gray-500">
                Systems create consistency. Consistency creates confidence.
              </p>
              <p className="text-2xl md:text-4xl font-black text-gray-900 mt-2">Confidence changes everything.</p>
            </div>
          </div>
        </section>

        {/* YOU'LL BUILD */}
        <section className="py-20 md:py-24 bg-[#F4F1EC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#0D9488] font-bold uppercase tracking-[0.2em] text-sm mb-3">The Outcome</p>
              <h2 style={GLOW} className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">You&apos;ll Build</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BUILD.map(({ icon: Icon, label }) => (
                <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <Icon className="mx-auto h-8 w-8 text-[#e07800] mb-3" />
                  <p className="font-bold text-gray-900">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE EXPERT — Krystalore + Secret Weapon */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl shadow-2xl">
                <Image src="/images/krystalore/speaker-event-ros.jpg" alt="Krystalore Crews — performance and wellness strategist, speaker, and veteran" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div>
                <p className="text-[#0D9488] font-bold uppercase tracking-[0.2em] text-sm mb-3">Your Coach</p>
                <h2 style={GLOW} className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-5">Led by a proven high performer.</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Krystalore Crews built her life on the same standard she teaches: show up, do the work, and never trade your health for success. She&apos;s the performance edge behind leaders who refuse to put themselves last.
                </p>
                <ul className="space-y-3 mb-8">
                  {CREDS.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-gray-800 font-semibold">
                      <Award className="h-5 w-5 flex-shrink-0 text-[#E8A849] mt-0.5" /> {c}
                    </li>
                  ))}
                </ul>
                <div className="rounded-2xl bg-[#F6F8FA] border border-gray-100 p-6">
                  <p className="text-gray-700">
                    She&apos;s the Secret Weapon high performers call when their health can no longer come last.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY BEYOND LIMITS — comparison */}
        <section className="py-20 md:py-24 bg-[#F6F8FA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#0D9488] font-bold uppercase tracking-[0.2em] text-sm mb-3">Why Beyond Limits</p>
              <h2 style={GLOW} className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Beyond Limits vs Traditional Fitness</h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm bg-white">
              <div className="grid grid-cols-2">
                <div className="px-5 py-4 font-bold text-gray-400 text-sm uppercase tracking-widest bg-gray-100">Traditional Fitness</div>
                <div className="px-5 py-4 font-black text-white text-sm uppercase tracking-widest bg-gradient-to-r from-[#E8A849] to-[#e07800]">Beyond Limits</div>
              </div>
              {COMPARE.map(([trad, bl], i) => (
                <div key={trad} className={`grid grid-cols-2 ${i % 2 ? 'bg-[#F6F8FA]' : 'bg-white'}`}>
                  <div className="px-5 py-4 text-gray-400 line-through decoration-gray-300 flex items-center gap-2">
                    <X className="h-4 w-4 flex-shrink-0 text-gray-300" /> {trad}
                  </div>
                  <div className="px-5 py-4 font-bold text-gray-900 flex items-center gap-2">
                    <Check className="h-4 w-4 flex-shrink-0 text-[#0D9488]" /> {bl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO THIS IS FOR */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#0D9488] font-bold uppercase tracking-[0.2em] text-sm mb-3">Who This Is For</p>
              <h2 style={GLOW} className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Built for people ready to lead themselves first.</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {FOR_LIST.map((f) => (
                <div key={f} className="flex items-start gap-3 rounded-2xl bg-[#F6F8FA] p-5 text-lg text-gray-800 font-medium">
                  <Target className="h-6 w-6 flex-shrink-0 text-[#0D9488] mt-0.5" /> {f}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {AUDIENCE.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 rounded-full bg-[#34c5c5]/10 text-[#0D9488] px-4 py-2 text-sm font-bold">
                  <Users className="h-4 w-4" /> {a}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* WHO THIS IS NOT FOR */}
        <section className="py-20 md:py-24 bg-[#F4F1EC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 style={GLOW} className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">This is NOT for you if…</h2>
            </div>
            <ul className="space-y-4">
              {NOT_FOR.map((n) => (
                <li key={n} className="flex items-start gap-3 rounded-2xl bg-white p-5 text-lg text-gray-700">
                  <X className="h-6 w-6 flex-shrink-0 text-[#e07800] mt-0.5" /> {n}
                </li>
              ))}
            </ul>
            <p className="mt-10 text-center text-xl md:text-2xl font-black text-gray-900">
              This community is built for people ready to lead themselves.
            </p>
          </div>
        </section>

        {/* THE NO MATTER WHAT STANDARD */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-[#E8A849] to-[#e07800] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white/80 font-bold uppercase tracking-[0.25em] text-sm mb-4">The Standard</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-10">The No Matter What Standard</h2>
            <div className="space-y-3 text-xl md:text-2xl font-light text-white/90">
              {NMW.map(([a, b]) => (
                <p key={a}>{a} <span className="font-black text-white">{b}</span></p>
              ))}
            </div>
            <p className="mt-10 text-4xl md:text-6xl font-black tracking-tight">No Matter What.</p>
          </div>
        </section>

        {/* CHOOSE YOUR PLAN — pricing (kept) */}
        <section id="pricing" className="py-20 md:py-24 px-4 bg-[#F6F8FA]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#0D9488] font-bold uppercase tracking-[0.2em] text-sm mb-3">Membership</p>
              <h2 style={GLOW} className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Choose Your Plan</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Month to Month', price: '$109', period: '/mo', desc: 'No commitment. Cancel anytime.', accent: '#0D9488' },
                { name: '6-Month Contract', price: '$99', period: '/mo', desc: 'Save $60 over 6 months.', accent: '#14B8A6' },
                { name: '12-Month Contract', price: '$89', period: '/mo', desc: 'Best value. Save $240/year.', accent: '#F97316', popular: true },
                { name: 'Veteran/MilSpouse', price: '$69', period: '/mo', desc: 'Thank you for your service.', accent: '#37a6a6' },
              ].map(({ name, price, period, desc, accent, popular }, i) => (
                <div key={i} className={`bg-white rounded-2xl p-6 text-center shadow-md relative ${popular ? 'ring-2 ring-[#F97316]' : ''}`}>
                  {popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full">Best Value</div>
                  )}
                  <h3 className="font-bold text-gray-800 text-sm mb-3">{name}</h3>
                  <div className="mb-3">
                    <span className="text-3xl font-black" style={{ color: accent }}>{price}</span>
                    <span className="text-gray-500 text-sm">{period}</span>
                  </div>
                  <p className="text-gray-600 text-xs mb-4">{desc}</p>
                  <a
                    href={CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 rounded-full text-white font-bold text-sm hover:scale-105 transition-transform"
                    style={{ backgroundColor: accent }}
                  >
                    Select Plan
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 style={GLOW} className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-5">Lead Yourself First.</h2>
            <p className="text-lg md:text-xl text-gray-600 mb-9">
              Thirty minutes. Anywhere. No matter what. This is where high performers stop putting their health last.
            </p>
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E8A849] to-[#e07800] text-white font-bold text-lg px-10 py-5 rounded-full shadow-lg hover:scale-105 transition-transform">
              Start Living Beyond Limits <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
