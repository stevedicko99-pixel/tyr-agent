import { NextRequest, NextResponse } from 'next/server'
import { createError, handleApiError, validationError } from '@/lib/api/error-handler'

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

    if (!targetLang || !['zh', 'fr'].includes(targetLang)) {
      const err = validationError('targetLang', 'Invalid target language')
      return NextResponse.json({ error: err }, { status: 400 })
    }

    if (!sourceLang || !['zh', 'fr'].includes(sourceLang)) {
      const err = validationError('sourceLang', 'Invalid source language')
      return NextResponse.json({ error: err }, { status: 400 })
    }

    const apiKey = process.env.MISTRAL_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        translation: text,
        warning: 'API key not configured'
      })
    }

    const targetLanguage = targetLang === 'zh' ? 'Chinese' : 'French'
    const sourceLanguage = sourceLang === 'zh' ? 'Chinese' : 'French'

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'mistral-small',
        messages: [
          {
            role: 'system',
            content: 'Translate text naturally'
          },
          {
            role: 'user',
            content: 'Translate from ' + sourceLanguage + ' to ' + targetLanguage + ': ' + text
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      let errorData = {}
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: await response.text() }
      }

      console.error('API error:', errorData)

      if (response.status === 401) {
        const err = createError('Invalid API key', 'INVALID_API_KEY')
        return NextResponse.json({ error: err }, { status: 401 })
      }

      if (response.status === 429) {
        const err = createError('Too many requests', 'RATE_LIMITED', 'Try again later')
        return NextResponse.json({ error: err }, { status: 429 })
      }

      const err = createError('Translation error', 'TRANSLATION_ERROR', JSON.stringify(errorData))
      return NextResponse.json({ error: err }, { status: 500 })
    }

    const data = await response.json()
    const translation = data.choices?.[0]?.message?.content?.trim()

    if (!translation) {
      const err = createError('No translation', 'EMPTY_TRANSLATION')
      return NextResponse.json({ error: err }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: { translation }
    })
  } catch (error) {
    console.error('Error:', error)
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError }, { status: 500 })
  }
}
