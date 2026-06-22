import { NextRequest, NextResponse } from 'next/server'
import { createError, handleApiError, validationError } from '@/lib/api/error-handler'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang } = await request.json()

    if (!text || typeof text !== 'string') {
      const error = validationError('text', 'Text to translate is required')
      return NextResponse.json({ error }, { status: 400 })
    }

    if (!targetLang || !['zh', 'fr'].includes(targetLang)) {
      const error = validationError('targetLang', 'Invalid target language. Accepted values: zh, fr')
      return NextResponse.json({ error }, { status: 400 })
    }

    if (!sourceLang || !['zh', 'fr'].includes(sourceLang)) {
      const error = validationError('sourceLang', 'Invalid source language. Accepted values: zh, fr')
      return NextResponse.json({ error }, { status: 400 })
    }

    const apiKey = process.env.MISTRAL_API_KEY

    if (!apiKey) {
      return NextResponse.json({ 
        translation: text,
        warning: 'Mistral API key not configured, returning original text'
      })
    }

    const targetLanguage = targetLang === 'zh' ? 'Chinese' : 'French'
    const sourceLanguage = sourceLang === 'zh' ? 'Chinese' : 'French'

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translation assistant. Translate only the provided text naturally and professionally. Do not make any changes other than translation. If the text is already in the target language, return it as is.'
          },
          {
            role: 'user',
            content: `Translate this text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: await response.text() }))
      console.error('Mistral API error:', errorData)
      
      if (response.status === 401) {
        const error = createError('Invalid Mistral API key', 'INVALID_API_KEY')
        return NextResponse.json({ error }, { status: 401 })
      }
      
      if (response.status === 429) {
        const error = createError('Too many requests to Mistral API', 'RATE_LIMITED', 'Please try again later')
        return NextResponse.json({ error }, { status: 429 })
      }

      const error = createError('Translation error', 'TRANSLATION_ERROR', JSON.stringify(errorData))
      return NextResponse.json({ error }, { status: 500 })
    }

    const data = await response.json()
    const translation = data.choices?.[0]?.message?.content?.trim()

    if (!translation) {
      const error = createError('No translation received', 'EMPTY_TRANSLATION')
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      data: { translation }
    })
  } catch (error) {
    console.error('Translation error:', error)
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError }, { status: 500 })
  }
}
