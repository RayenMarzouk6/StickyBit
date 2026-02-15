'use client'

import Link from 'next/link'
import { Shield, Twitter, Facebook, Instagram, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white border-t border-emerald-500/20 mt-12 relative overflow-hidden">
      {/* Background overlay effect */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Shield className="h-7 w-7 text-emerald-400" />
              <span>
                Cyber<span className="text-emerald-400">Aman</span>
              </span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              منصة تثقيفية لحماية نفسك من الاحتيالات الإلكترونية والتصيد الاحتيالي
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-emerald-400 mb-4">روابط سريعة</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link 
                  href="/academy" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  الأكاديمية
                </Link>
              </li>
              <li>
                <Link 
                  href="/glossary" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  القاموس
                </Link>
              </li>
              <li>
                <Link 
                  href="/report" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  بلّغ عن احتيال
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-emerald-400 mb-4">الأدوات</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/detector" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  كاشف الاحتيالات
                </Link>
              </li>
              <li>
                <Link 
                  href="/simulator" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  محاكي الهجوم
                </Link>
              </li>
              <li>
                <Link 
                  href="/assessment" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  اختبر أمانك
                </Link>
              </li>
              <li>
                <Link 
                  href="/recovery" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  دليل التعافي
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-emerald-400 mb-4">موارد</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/profile" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  ملفي الشخصي
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-emerald-500/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-slate-400">
            &copy; 2024 <span className="text-emerald-400 font-semibold">CyberAman</span>. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a 
              href="#" 
              className="text-slate-400 hover:text-emerald-400 transition-all hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-emerald-400 transition-all hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-emerald-400 transition-all hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-emerald-400 transition-all hover:scale-110"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}