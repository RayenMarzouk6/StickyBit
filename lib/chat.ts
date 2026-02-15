'use server'

export async function getChatResponse(userMessage: string) {
  if (!userMessage?.trim()) {
    return {
      success: false,
      message: 'يرجى إدخال رسالة صالحة.',
    }
  }

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer':
            process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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
                '- استخدم العربية البسيطة فقط.\n' +
                '- قدّم نصائح عملية واضحة.\n' +
                '- إذا كان هناك خطر، ابدأ بتحذير واضح.',
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],

          max_tokens: 300, // ⬅️ أقصر = أوضح
          temperature: 0.3, // ⬅️ يقلّل التطويل
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `OpenRouter API error: ${response.status} - ${
          errorData?.error?.message || 'Unknown error'
        }`
      )
    }

    const data = await response.json()

    return {
      success: true,
      message:
        data?.choices?.[0]?.message?.content ??
        'لم يتم الحصول على استجابة من النموذج.',
    }
  } catch (error: any) {
    console.error('Error calling OpenRouter:', error)

    let errorMessage =
      'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.'

    if (error?.message?.includes('401')) {
      errorMessage = 'مفتاح API غير صالح. تحقق من إعداداتك.'
    } else if (error?.message?.includes('402')) {
      errorMessage =
        'رصيد الذكاء الاصطناعي غير كافٍ حالياً. حاول تقليل طول السؤال.'
    }

    return {
      success: false,
      message: errorMessage,
    }
  }
}
