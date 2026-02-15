'use client'

import { motion } from 'framer-motion'
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
  Lock,
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
<div className="space-y-24">
 <section className="text-center py-16 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
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
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-6 text-xl shadow-lg shadow-emerald-500/20"
                onClick={() => onNavigate("investigator")}
              >
                جرب المحقق الرقمي
                <ArrowLeft className="mr-2 h-5 w-5 rotate-180" />{" "}
                {/* RTL arrow fix */}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-400 text-slate-200 hover:bg-slate-800 hover:text-white px-8 py-6 text-xl"
                onClick={() => onNavigate("analyzer")}
              >
                فحص رابط مشبوه
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
{/* 
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { label: 'مستخدم محمي', value: '+15,000' },
          { label: 'رابط مفحوص', value: '+50,000' },
          { label: 'بلاغ تم حله', value: '98%' },
          { label: 'شريك حكومي', value: '5' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-white border-none shadow-md">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-emerald-600 mb-1">{stat.value}</div>
              <div className="text-slate-500 font-medium">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">خدماتنا ليك</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            أدوات متطورة وسهلة الاستخدام باش تحمي روحك وعائلتك من المخاطر الموجودة على الإنترنت.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="h-full transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                <Card className="h-full border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-colors">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <CardTitle className="mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-slate-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-2/3">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            تحب تعلم والديك كيفاش يحميو رواحهم؟
          </h2>
          <p className="text-slate-600 text-lg mb-6">
            وفرنا "وضع الكبار" خصيصاً لكبار السن، بخط كبير وواجهة مبسطة وشرح صوتي باش يفهمو المخاطر بسهولة.
          </p>
          <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
            <Link href="/academy">ابدأ التعلم الآن</Link>
          </Button>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20" aria-hidden="true"></div>
            <Shield className="h-32 w-32 text-slate-800 relative z-10" aria-hidden="true" />
          </div>
        </div>
      </section> */}
    </div>
  )
}
