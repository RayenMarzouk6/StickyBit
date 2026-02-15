'use client'

import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'

import { ThreatCards } from '@/components/home/threat-cards'
import { DailyTip } from '@/components/home/daily-tip'
import { useEffect } from 'react'
import { applyAccessibilityStyles } from '@/lib/accessibility'
import { Hero } from '@/components/home/hero'

export default function Page() {
  useEffect(() => {
    applyAccessibilityStyles()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <ThreatCards />
        <DailyTip />
      </main>
      <Footer />
    </div>
  )
}
