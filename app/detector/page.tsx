'use client'

import { useState, useRef } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, Info, Link2, Shield } from 'lucide-react'

type RiskLevel = null | 'safe' | 'suspicious' | 'danger'

export default function DetectorPage() {
  const [textInput, setTextInput] = useState('')
  const [result, setResult] = useState<{
    risk: RiskLevel
    riskScore: number
    findings: { keyword: string; risk: string; message: string }[]
    virusTotalData?: {
      malicious: number
      suspicious: number
      harmless: number
      undetected: number
      total: number
    }
  } | null>(null)
  const [isAnalyzingText, setIsAnalyzingText] = useState(false)

  // Extract URLs from text
  const extractUrls = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi
    const matches = text.match(urlRegex) || []
    // Add https:// to www. links
    return matches.map(url => url.startsWith('www') ? `https://${url}` : url)
  }

  // Analyze URL with VirusTotal API
  const analyzeUrlWithVirusTotal = async (url: string) => {
    try {
      console.log('Analyzing URL:', url)
      const response = await fetch('/api/check-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() })
      })

      if (!response.ok) {
        console.error('API error:', response.statusText)
        return null
      }

      const data = await response.json()
      console.log('URLScan response:', data)
      // return URLScan submission info (uuid, resultUrl)
      return data
    } catch (error) {
      console.error('VirusTotal URL analysis error:', error)
      return null
    }
  }

  const analyzeContent = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return

    setIsAnalyzingText(true)

    let risk: RiskLevel = 'safe'
    let riskScore = 0
    const findings: { keyword: string; risk: string; message: string }[] = []
    let virusTotalData = undefined

    // Extract and analyze URLs with VirusTotal
    const urls = extractUrls(textToAnalyze)
    if (urls.length > 0) {
      console.log('Found URLs:', urls)
      for (const url of urls) {
        const vtResult = await analyzeUrlWithVirusTotal(url)
        
        if (vtResult?.data?.attributes) {
          const stats = vtResult.data.attributes.last_analysis_stats || {}
          virusTotalData = {
            malicious: stats.malicious || 0,
            suspicious: stats.suspicious || 0,
            harmless: stats.harmless || 0,
            undetected: stats.undetected || 0,
            total: (stats.malicious || 0) + (stats.suspicious || 0) + (stats.harmless || 0) + (stats.undetected || 0)
          }

          // Add finding for URL analysis
          if (stats.malicious && stats.malicious > 0) {
            riskScore += 40
            findings.push({
              keyword: 'VirusTotal: رابط خطير 🚨',
              risk: 'danger',
              message: `${stats.malicious} محرك أمان اكتشف تهديداً في: ${new URL(url).hostname}`
            })
          } else if (stats.suspicious && stats.suspicious > 0) {
            riskScore += 25
            findings.push({
              keyword: 'VirusTotal: رابط مشبوه ⚠️',
              risk: 'suspicious',
              message: `${stats.suspicious} محرك اعتبر الرابط مشبوهاً: ${new URL(url).hostname}`
            })
          } else if (stats.harmless && stats.harmless > 0) {
            findings.push({
              keyword: 'VirusTotal: رابط نظيف ✅',
              risk: 'safe',
              message: `${stats.harmless} محرك أكد أمان الرابط: ${new URL(url).hostname}`
            })
          }
        }
      }
    } else {
      findings.push({
        keyword: 'لم يتم العثور على روابط',
        risk: 'safe',
        message: 'لا توجد روابط في النص المدخل للفحص'
      })
    }

    // Determine risk level
    if (riskScore >= 60) risk = 'danger'
    else if (riskScore >= 30) risk = 'suspicious'
    else risk = 'safe'

    setResult({
      risk,
      riskScore: Math.min(riskScore, 100),
      findings: [...new Map(findings.map(f => [f.keyword, f])).values()],
      virusTotalData
    })
    setIsAnalyzingText(false)
  }



  const getRiskColor = (score: number) => {
    if (score >= 70) return 'rgb(239, 68, 68)'
    if (score >= 40) return 'rgb(245, 158, 11)'
    return 'rgb(16, 185, 129)'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'تهديد مرتفع: محاولة احتيال مالي'
    if (score >= 40) return 'مشبوه: يحتاج تحقق'
    return 'آمن نسبياً'
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              محلل التهديدات الذكي
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              حلّل أي رسالة أو رابط أو صورة مشبوهة للكشف عن محاولات الاحتيال
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
              <Shield className="w-4 h-4" />
              مدعوم بـ VirusTotal API
            </div>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left side - Risk Score Circle */}
            <div className="space-y-6">
              <Card className="p-8 bg-white border-slate-200 shadow-md">
                <div className="flex flex-col items-center">
                  {/* Circular progress */}
                  <div className="relative h-64 w-64 mb-6">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="85" 
                        fill="none" 
                        stroke="#e2e8f0" 
                        strokeWidth="12" 
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="85"
                        fill="none"
                        stroke={result ? getRiskColor(result.riskScore) : '#e2e8f0'}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(result?.riskScore || 0) * 5.34} 534`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span 
                        className="text-6xl font-black"
                        style={{ color: result ? getRiskColor(result.riskScore) : '#94a3b8' }}
                      >
                        {result?.riskScore || 0}%
                      </span>
                      <span className="text-sm text-slate-500 mt-2">درجة الخطر</span>
                    </div>
                  </div>

                  {result && (
                    <div 
                      className={`rounded-full px-6 py-2 text-sm font-semibold ${
                        result.riskScore >= 70
                          ? 'bg-red-100 text-red-700'
                          : result.riskScore >= 40
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {getRiskLabel(result.riskScore)}
                    </div>
                  )}
                </div>
              </Card>

              {/* VirusTotal Results */}
              {result?.virusTotalData && (
                <Card className="p-6 bg-white border-slate-200 shadow-md">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <Shield className="h-5 w-5 text-blue-600" />
                    نتائج VirusTotal
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="text-2xl font-bold text-red-700">
                        {result.virusTotalData.malicious}
                      </div>
                      <div className="text-xs text-red-600">خطير</div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                      <div className="text-2xl font-bold text-amber-700">
                        {result.virusTotalData.suspicious}
                      </div>
                      <div className="text-xs text-amber-600">مشبوه</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <div className="text-2xl font-bold text-emerald-700">
                        {result.virusTotalData.harmless}
                      </div>
                      <div className="text-xs text-emerald-600">آمن</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-2xl font-bold text-slate-700">
                        {result.virusTotalData.undetected}
                      </div>
                      <div className="text-xs text-slate-600">غير مكتشف</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 text-center">
                    تم الفحص بواسطة {result.virusTotalData.total} محرك أمان
                  </div>
                </Card>
              )}

              {/* Indicators */}
              {result && result.findings.length > 0 && (
                <Card className="p-6 bg-white border-slate-200 shadow-md">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <Info className="h-5 w-5 text-emerald-600" />
                    لماذا يعتبر هذا تهديداً؟
                  </h3>
                  <ul className="space-y-3">
                    {result.findings.map((finding, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <div>
                          <p className="text-slate-900 font-semibold">{finding.keyword}</p>
                          <p className="text-slate-600 text-xs mt-1">{finding.message}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Recommendations */}
              {result && (
                <Card className={`p-6 border-2 ${
                  result.riskScore >= 70
                    ? 'bg-red-50 border-red-200'
                    : result.riskScore >= 40
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <h4 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle className={`h-5 w-5 ${
                      result.riskScore >= 70
                        ? 'text-red-600'
                        : result.riskScore >= 40
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`} />
                    نصيحة فورية
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {result.riskScore >= 70 && '⛔ خطر عالي! لا تضغط على أي رابط ولا تعطي أي معلومات. بلّغ فوراً.'}
                    {result.riskScore >= 40 && result.riskScore < 70 && '⚠️ مشبوه! تحقق من المصدر الرسمي قبل أي تفاعل.'}
                    {result.riskScore < 40 && '✅ يبدو آمناً، لكن كن حذراً دائماً مع الرسائل من مصادر غير معروفة.'}
                  </p>
                </Card>
              )}
            </div>

            {/* Right side - Input sections */}
            <div className="space-y-6">
              {/* URL/Link Input Section */}
              <Card className="p-6 bg-white border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Link2 className="h-5 w-5 text-emerald-600" />
                  فحص رابط (URL Scanning)
                </h3>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="أدخل الرابط هنا..."
                  className="mb-4 w-full rounded-lg border-2 border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  rows={3}
                />
                <Button
                  onClick={() => analyzeContent(textInput)}
                  disabled={isAnalyzingText || !textInput.trim()}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 text-base shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzingText ? (
                    <>
                      <span className="animate-spin me-2">⏳</span>
                      جاري الفحص...
                    </>
                  ) : (
                    <>
                      <span className="me-2">🔍</span>
                      فحص الرابط
                    </>
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}