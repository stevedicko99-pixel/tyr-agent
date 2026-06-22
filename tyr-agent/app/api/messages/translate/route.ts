import { NextRequest, NextResponse } from 'next/server'
import { createError, handleApiError, validationError } from '@/lib/api/error-handler'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang } = await request.json()

    // Validation
    if (!text || typeof text !== 'string') {
      const error = validationError('text', 'Le texte à traduire est requis')
      return NextResponse.json({ error }, { status: 400 })
    }

    if (!targetLang || !['zh', 'fr'].includes(targetLang)) {
      const error = validationError('targetLang', 'Langue cible invalide. Valeurs acceptées: zh, fr')
      return NextResponse.json({ error }, { status: 400 })
    }

    if (!sourceLang || !['zh', 'fr'].includes(sourceLang)) {
      const error = validationError('sourceLang', 'Langue source invalide. Valeurs acceptées: zh, fr')
      return NextResponse.json({ error }, { status: 400 })
    }

    const apiKey = process.env.MISTRAL_API_KEY

    if (!apiKey) {
      // Fallback: return text with a note - this is expected behavior, not an error
      return NextResponse.json({ 
        translation: text,
        warning: 'Clé API Mistral non configurée, retour du texte original'
      })
    }

    const targetLanguage = targetLang === 'zh' ? 'chinois' : 'français'
    const sourceLanguage = sourceLang === 'zh' ? 'chinois' : 'français'

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
            content: `Tu es un assistant de traduction professionnel. Traduis uniquement le texte fourni de manière naturelle et professionnelle. Ne fais aucune modification autre que la traduction. Si le texte est déjà dans la langue cible, retourne-le tel quel.`
          },
          {
            role: 'user',
            content: `Traduis ce texte du ${sourceLanguage} vers le ${targetLanguage}:\n\n${text}`
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
        const error = createError('Clé API Mistral invalide', 'INVALID_API_KEY')
        return NextResponse.json({ error }, { status: 401 })
      }
      
      if (response.status === 429) {
        const error = createError('Trop de requêtes à l\'API Mistral', 'RATE_LIMITED', 'Veuillez réessayer plus tard')
        return NextResponse.json({ error }, { status: 429 })
      }

      const error = createError('Erreur de traduction', 'TRANSLATION_ERROR', JSON.stringify(errorData))
      return NextResponse.json({ error }, { status: 500 })
    }

    const data = await response.json()
    const translation = data.choices?.[0]?.message?.content?.trim()

    if (!translation) {
      const error = createError('Pas de traduction reçue', 'EMPTY_TRANSLATION')
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
