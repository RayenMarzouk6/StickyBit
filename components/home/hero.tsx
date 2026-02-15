'use client'
'use client'
import { motion } from "framer-motion";
import Link from 'next/link';

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Activity,
  ArrowLeft,
  BookOpen,
  Gamepad2,
  Lock,
  Search,
  Shield,
  Smartphone,
} from 'lucide-react'

export function Hero() {
  const features = [
    {
      icon: Smartphone,
      title: 'كاشف الاحتيال الذكي',
      desc: 'تحليل الرسائل والروابط المشبوهة فورياً باستخدام الذكاء الاصطناعي.',
    },
    {
      icon: Activity,
      title: 'محاكي الهجمات',
      desc: 'تعلم كيف تكتشف الخداع عبر تجربة سيناريوهات واقعية آمنة.',
    },
    {
      icon: Lock,
      title: "المساعد القانوني 'حكيم'",
      desc: 'شات بوت متخصص في القوانين التونسية للجرائم الإلكترونية.',
    },
    {
      icon: Shield,
      title: 'دليل الطوارئ',
      desc: 'خطوات فورية لاستعادة حساباتك وحماية أموالك بعد الاختراق.',
    },
  ]

    function onNavigate(arg0: string): void {
        throw new Error('Function not implemented.')
    }

  return (
<div className="space-y-24 px-4 md:px-8 lg:px-12 pt-5 md:pt-10">
 <section className="text-center py-20 px-6 md:px-12 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="h-20 w-20 text-emerald-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              دافع على روحك في{" "}
              <span className="text-emerald-400">
                العالم الرقمي
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
              أول منصة تونسية ذكية لحمايتك من التحيل الإلكتروني،
              سرقة البيانات، والابتزاز.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Check Link */}
              <Link href="/detector" className="flex-1">
                <Button
                  size="lg"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-base md:text-lg font-semibold shadow-lg shadow-emerald-500/20"
                >
                  <Search className="w-5 h-5 me-2" />
                  هل هذا آمن؟
                </Button>
              </Link>

              {/* Simulator */}
              <Link href="/simulator" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-emerald-400 text-emerald-400 hover:bg-emerald-500 hover:text-white text-base md:text-lg font-semibold"
                >
                  <Gamepad2 className="w-5 h-5 me-2" />
                  جرّب هجوم وهمي
                </Button>
              </Link>

              {/* Learn */}
              <Link href="/academy" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-emerald-400 text-emerald-400 hover:bg-emerald-500 hover:text-white text-base md:text-lg font-semibold"
                >
                  <BookOpen className="w-5 h-5 me-2" />
                  تعلّم
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
