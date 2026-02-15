'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'

import { PointsToast } from '@/components/shared/points-toast'
import { applyAccessibilityStyles } from '@/lib/accessibility'
import { addPoints, POINTS } from '@/lib/scoring'
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { scenarios } from '@/lib/simulator_data'

export default function SimulatorPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [showPointsToast, setShowPointsToast] = useState(false)
  const [lastPointsEarned, setLastPointsEarned] = useState(0)

  useEffect(() => {
    applyAccessibilityStyles()
  }, [])

  const currentScenario = scenarios[currentIndex]
  const isCorrect = userAnswer === currentScenario.safe
  const scorePoints = totalAnswered > 0 ? Math.round((score / totalAnswered) * 1000) : 0

  // ✅ FIX: safe access to redFlags — normalize to array regardless of shape
  const redFlags: string[] = Array.isArray(currentScenario.redFlags)
    ? currentScenario.redFlags
    : currentScenario.redFlags
    ? [String(currentScenario.redFlags)]
    : []

  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer)
    setAnswered(true)
    setTotalAnswered(prev => prev + 1)

    if (answer === currentScenario.safe) {
      setScore(prev => prev + 1)
      setLastPointsEarned(POINTS.SCENARIO_CORRECT)
      addPoints(POINTS.SCENARIO_CORRECT)
    } else {
      setLastPointsEarned(POINTS.SCENARIO_INCORRECT)
      addPoints(POINTS.SCENARIO_INCORRECT)
    }
    setShowPointsToast(true)
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev < scenarios.length - 1 ? prev + 1 : 0))
    setAnswered(false)
    setUserAnswer(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PointsToast
        points={lastPointsEarned}
        show={showPointsToast}
        onClose={() => setShowPointsToast(false)}
      />
      <Header />

      <main className="flex-1 pt-20">
        <div className="container py-8">

          {/* ── Page Header ── */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">المحقق الرقمي</h1>
                <p className="text-xs text-muted-foreground">تعلّم تكشف الاحتيال</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                <span className="text-sm text-muted-foreground">مستوى الحماية</span>
                <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${totalAnswered > 0 ? (score / totalAnswered) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                <span className="text-lg font-bold text-yellow-600">{scorePoints}</span>
                <span className="text-sm text-muted-foreground">نقطة</span>
              </div>
            </div>
          </div>

          {/* ── Main Grid ── */}
          <div className="grid gap-8 lg:grid-cols-2">

            {/* ── LEFT: Phone Mockup ── */}
            <div className="flex items-start justify-center order-2 lg:order-1">
              {/* Outer phone shell — dark like the screenshot */}
              <div className="w-full max-w-[320px] rounded-[2.5rem] border-[10px] border-gray-900 bg-gray-900 shadow-2xl ring-1 ring-white/10">

                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-3 pb-1">
                  <span className="text-[11px] font-semibold text-white/70">9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/70 text-xs">●●●</span>
                  </div>
                </div>

                {/* Notch */}
                <div className="flex justify-center pb-2">
                  <div className="h-[6px] w-24 rounded-full bg-gray-800" />
                </div>

                {/* Chat screen — dark background */}
                <div className="rounded-b-[1.8rem] bg-[#1c1c1e] pb-3">

                  {/* Chat header */}
                  <div className="flex items-center gap-3 border-b border-white/10 bg-[#2c2c2e] px-4 py-3 rounded-none">
                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600">
                      <span className="text-sm font-bold text-white">
                        {currentScenario.sender?.charAt(0) ?? '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {currentScenario.sender}
                      </p>
                      <p className="text-xs text-gray-400">نشط منذ قليل</p>
                    </div>
                    {/* Blue verified-style icon matching screenshot */}
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600/20 border border-blue-500/30">
                      <span className="text-blue-400 text-xs font-bold">#</span>
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="min-h-[220px] space-y-3 overflow-y-auto px-3 py-4" dir="rtl">
                    <p className="text-center text-[11px] text-gray-500">اليوم</p>

                    {/* ✅ FIX: incoming messages on the RIGHT (RTL = sender is on the right visually)
                        In RTL layout, justify-end places the bubble on the LEFT which is where
                        the sender's messages should appear. We use justify-start for incoming. */}
                    {currentScenario.messages?.map((msg: { text: string; time: string }, i: number) => (
                      <div key={i} className="flex justify-start">
                        <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-[#3a3a3c] px-4 py-3 shadow">
                          <p className="text-sm leading-relaxed text-white" dir="rtl">
                            {msg.text}
                          </p>
                          <p className="mt-1 text-right text-[11px] text-gray-400">
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message input */}
                  <div className="mx-3 mt-1">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#2c2c2e] px-4 py-2.5">
                      <span className="text-sm text-gray-500 flex-1 text-right">اكتب رسالة...</span>
                      <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <svg className="h-3 w-3 text-white rotate-90" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Question & Answer ── */}
            <div className="order-1 lg:order-2">
              <div className="mb-4 inline-flex rounded-full bg-green-100 px-3 py-1">
                <span className="text-sm font-medium text-green-700">● التطبيق على</span>
              </div>

              <h2 className="mb-2 text-3xl font-black text-foreground">
                وصلتك هذي الرسالة على تليفونك.
              </h2>
              <h3 className="mb-4 text-3xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                شنوة قرارك؟
              </h3>

              <p className="mb-8 text-muted-foreground">
                ثبّت ملح في التفاصيل: الرسالة، الرابط، واسم المرسل. التسرّع ينجم يخلّيك تخسر معطياتك الشخصية ولا حق حسابك البنكي.
              </p>

              {!answered ? (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAnswer(false)}
                    className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 transition-all hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <span className="text-lg font-bold text-foreground">مشبوه</span>
                    <span className="text-sm text-muted-foreground">تحيّل واضح</span>
                  </button>

                  <button
                    onClick={() => handleAnswer(true)}
                    className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 transition-all hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="text-lg font-bold text-foreground">نثق فيه</span>
                    <span className="text-sm text-muted-foreground">رسالة رسمية عادية</span>
                  </button>
                </div>
              ) : (
                <div className="animate-fade-in-up space-y-4">
                  <div
                    className={`rounded-xl border p-6 ${
                      isCorrect
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30'
                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30'
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      )}
                      <span className="text-lg font-bold text-foreground">
                        {isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
                      </span>
                    </div>

                    <p className="mb-4 text-muted-foreground">{currentScenario.explanation}</p>

                    {/* ✅ FIX: use the pre-normalised `redFlags` array — no more crashes */}
                    {redFlags.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 font-semibold text-foreground">🚩 العلامات المشبوهة:</h4>
                        <ul className="space-y-1">
                          {redFlags.map((flag, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                              {flag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 dark:bg-blue-950/30 dark:border-blue-800">
                      <h4 className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                        💡 نصيحة من &quot;حكيم&quot;
                      </h4>
                      <p className="text-sm text-muted-foreground">{currentScenario.tips}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                  >
                    السؤال التالي ←
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Pagination ── */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">
              المرحلة {currentIndex + 1} من {scenarios.length}
            </span>
            <div className="flex gap-1.5">
              {scenarios.map((_: unknown, i: number) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-5 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}