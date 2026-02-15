'use server'

export async function getChatResponse(userMessage: string) {
  if (!userMessage?.trim()) {
    return {
      success: false,
      message: 'يرجى إدخال رسالة صالحة.',
    }
  }

  try {
    // Shared local/fallback responses used when AI provider is unavailable
    const LOCAL_RESPONSES: Record<string, { suggestions: string[]; response: string }> = {
      'حساب': {
        suggestions: [
          'غيّر كلمة السرّ فوراً إذا كنت متأكد من التسريب',
          'فعّل المصادقة الثنائية على حسابك',
          'تحقق من الأجهزة المرتبطة بحسابك واحذف غير المعروفة',
        ],
        response: 'إليك نصائح سريعة لحماية حسابك:'
      },
      'رسالة': {
        suggestions: [
          'لا تنقر على أي روابط في الرسالة',
          'احذف الرسالة فوراً',
          'بلّغ عن الرسالة كرسالة احتيالية',
        ],
        response: 'إذا استقبلت رسالة مريبة، نفّذ التالي:'
      },
      'كلمة': {
        suggestions: [
          'استخدم كلمة سرّ قوية (8+ أحرف + أرقام + رموز)',
          'لا تستخدم نفس الكلمة لكل الحسابات',
          'استخدم مدير كلمات سر (Bitwarden, 1Password)',
        ],
        response: 'نصائح لكلمة سرّ قوية:'
      },
      'رابط': {
        suggestions: [
          'لا تنقر على روابط من مصادر غير موثوقة',
          'تحقق من عنوان الموقع قبل إدخال بياناتك',
          'استخدم أداة كشف الروابط الخطرة',
        ],
        response: 'احذر من الروابط المريبة. اتبع هذه النصائح:'
      },
      'مصادقة': {
        suggestions: [
          'استخدم تطبيق المصادقة (Google Authenticator, Authy)',
          'احتفظ برموز النسخ الاحتياطي في مكان آمن',
          'غيّر الرقم المسجل إذا تم اختراقه',
        ],
        response: 'المصادقة الثنائية تحسّن أمن حسابك:'
      }
    }

    // Prefer server environment key when available
    const apiKey = process.env.OPENROUTER_API_KEY || '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';

    // If no API key is provided, fall back to a local canned-response mode
    if (!apiKey) {
      const lower = userMessage.toLowerCase()
      for (const key of Object.keys(LOCAL_RESPONSES)) {
        if (lower.includes(key)) {
          const data = LOCAL_RESPONSES[key]
          const message = `${data.response}\n${data.suggestions.map(s => '• ' + s).join('\n')}`
          return { success: true, message }
        }
      }

      // Generic fallback reply
      return {
        success: true,
        message:
          'مرحبا! لست متصلاً بخدمة الذكاء الصناعي الآن، لكن إليك بعض النصائح العامة:\n• تجنّب الضغط على روابط مشبوهة\n• فعّل المصادقة الثنائية\n• لا تشارك معلوماتك الحساسة'
      }
    }

    // If API key exists, call OpenRouter as before
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'cyberaman.vercel.app',
        'X-Title': 'CyberAman',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'stepfun/step-3.5-flash:free',
        messages: [
          {
            role: 'system',
            content:
              'أنت CyberAman Assistant.\n' +
              'قواعد صارمة للإجابة:\n' +
              '- أجب دائمًا بنقاط قصيرة (•).\n' +
              '- لا تكتب فقرات نهائيًا.\n' +
              "- استخدم العربية البسيطة فقط.\n" +
              "- قدّم نصائح عملية واضحة.\n" +
              "- إذا كان هناك خطر، ابدأ بتحذير واضح.",
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      let errorData: any = null
      try {
        errorData = await response.json()
      } catch (e) {
        // ignore parse errors
      }

      const status = response.status
      // For authentication errors, surface as before so the caller knows
      if (status === 401) {
        throw new Error(
          `OpenRouter API error: ${status} - ${errorData?.error?.message || 'Unauthorized'}`
        )
      }

      // Rate limit or provider errors: fall back to local responses instead of failing
      if (status === 429 || status >= 500) {
        console.warn('OpenRouter returned', status, '— falling back to local responses', errorData)
        const lower = userMessage.toLowerCase()
        for (const key of Object.keys(LOCAL_RESPONSES)) {
          if (lower.includes(key)) {
            const data = LOCAL_RESPONSES[key]
            const message = `${data.response}\n${data.suggestions.map(s => '• ' + s).join('\n')}`
            return { success: true, message }
          }
        }

        return {
          success: true,
          message:
            '• المزوّد الخارجي مؤقتاً غير متاح. إليك بعض النصائح العامة:\n• تجنّب الضغط على روابط مشبوهة\n• فعّل المصادقة الثنائية\n• لا تشارك معلوماتك الحساسة',
        }
      }

      // Other errors: throw so catch() can map to a useful message
      throw new Error(
        `OpenRouter API error: ${status} - ${errorData?.error?.message || 'Unknown error'}`
      )
    }

    const data = await response.json()
    return {
      success: true,
      message: data?.choices?.[0]?.message?.content ?? 'لم يتم الحصول على استجابة من النموذج.',
    }
  } catch (error: any) {
    console.error('Error calling OpenRouter or fallback:', error)
    let errorMessage = 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.'
    if (error?.message?.includes('401')) {
      errorMessage = 'مفتاح API غير صالح. تحقق من إعداداتك.'
    } else if (error?.message?.includes('402')) {
      errorMessage = 'رصيد الذكاء الاصطناعي غير كافٍ حالياً. حاول تقليل طول السؤال.'
    }
    return { success: false, message: errorMessage }
  }
}
