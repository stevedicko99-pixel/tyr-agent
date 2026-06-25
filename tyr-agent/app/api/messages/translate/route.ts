import { NextRequest, NextResponse } from 'next/server'
import { createError, handleApiError, validationError } from '@/lib/api/error-handler'

const LANGUAGE_MAP: Record<string, { name: string; code: string }> = {
  zh: { name: 'Chinese', code: 'zh' },
  fr: { name: 'French', code: 'fr' },
  en: { name: 'English', code: 'en' },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const text = body.text
    const targetLang = body.targetLang
    const sourceLang = body.sourceLang

    if (!text || typeof text !== 'string') {
      const err = validationError('text', 'Text required')
      return NextResponse.json({ error: err }, { status: 400 })
    }

    const targetLanguage = LANGUAGE_MAP[targetLang]
    const sourceLanguage = LANGUAGE_MAP[sourceLang]

    if (!targetLanguage) {
      const err = validationError('targetLang', 'Invalid target language')
      return NextResponse.json({ error: err }, { status: 400 })
    }

    if (!sourceLanguage) {
      const err = validationError('sourceLang', 'Invalid source language')
      return NextResponse.json({ error: err }, { status: 400 })
    }

    const apiKey = process.env.MISTRAL_API_KEY

    if (!apiKey) {
      console.warn('MISTRAL_API_KEY not configured, returning original text')
      return NextResponse.json({
        success: true,
        data: { translation: text },
        warning: 'API key not configured'
      })
    }

    const systemPrompt = `You are a professional translator specialized in international trade and import/export business communications.

Translate the following text from ${sourceLanguage.name} to ${targetLanguage.name}.

Rules:
1. Translate accurately and naturally, maintaining the original meaning
2. Keep proper names and company names unchanged
3. Maintain professional tone for business communications
4. Do not add any explanations, notes, or extra text - just provide the translation
5. Output ONLY the translated text, nothing else

Translate directly without prefix or suffix.`

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: 'text' }
      })
    })

    if (!response.ok) {
      let errorData = {}
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: await response.text() }
      }

      console.error('Mistral API error:', errorData)

      if (response.status === 401) {
        const err = createError('Invalid API key', 'INVALID_API_KEY')
        return NextResponse.json({ error: err }, { status: 401 })
      }

      if (response.status === 429) {
        const err = createError('Too many requests', 'RATE_LIMITED', 'Try again later')
        return NextResponse.json({ error: err }, { status: 429 })
      }

      if (response.status >= 500) {
        const err = createError('Service unavailable', 'SERVICE_UNAVAILABLE', 'Please try again later')
        return NextResponse.json({ error: err }, { status: 503 })
      }

      const err = createError('Translation error', 'TRANSLATION_ERROR', JSON.stringify(errorData))
      return NextResponse.json({ error: err }, { status: 500 })
    }

    const data = await response.json()
    const translation = data.choices?.[0]?.message?.content?.trim()

    if (!translation) {
      console.warn('Empty translation result, returning original text')
      return NextResponse.json({
        success: true,
        data: { translation: text },
        warning: 'Empty translation result'
      })
    }

    return NextResponse.json({
      success: true,
      data: { translation }
    })
  } catch (error) {
    console.error('Translation route error:', error)
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError }, { status: 500 })
  }
}
