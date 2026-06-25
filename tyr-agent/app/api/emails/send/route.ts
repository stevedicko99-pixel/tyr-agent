import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { 
  createProjectConfirmationEmail,
  createProjectUpdateEmail,
  createOrderRequestEmail,
  createPaymentReminderEmail,
  createShippingNotificationEmail
} from '@/lib/email-templates'
import { createError, handleApiError, validationError } from '@/lib/api/error-handler'

type EmailType = 
  | 'project_confirmation'
  | 'project_update'
  | 'order_request'
  | 'payment_reminder'
  | 'shipping_notification'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const emailType: EmailType = body.emailType
    const to = body.to
    const data = body.data

    if (!emailType) {
      const err = validationError('emailType', 'Email type is required')
      return NextResponse.json({ error: err }, { status: 400 })
    }

    if (!to || (typeof to !== 'string' && !Array.isArray(to))) {
      const err = validationError('to', 'Recipient email is required')
      return NextResponse.json({ error: err }, { status: 400 })
    }

    let subject = ''
    let html = ''

    switch (emailType) {
      case 'project_confirmation':
        subject = `Confirmation de votre projet - TYR Agent`
        html = createProjectConfirmationEmail(data)
        break
      case 'project_update':
        subject = `Mise à jour de votre projet - TYR Agent`
        html = createProjectUpdateEmail(data)
        break
      case 'order_request':
        subject = `Nouvelle demande de commande - TYR Agent`
        html = createOrderRequestEmail(data)
        break
      case 'payment_reminder':
        subject = `Rappel de paiement - TYR Agent`
        html = createPaymentReminderEmail(data)
        break
      case 'shipping_notification':
        subject = `Votre commande a été expédiée - TYR Agent`
        html = createShippingNotificationEmail(data)
        break
      default:
        const err = validationError('emailType', 'Invalid email type')
        return NextResponse.json({ error: err }, { status: 400 })
    }

    const result = await sendEmail({ to, subject, html })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      }, { status: 200 })
    } else {
      const err = createError('Email sending failed', 'EMAIL_FAILED', result.error)
      return NextResponse.json({ error: err }, { status: 500 })
    }
  } catch (error) {
    console.error('Email API error:', error)
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError }, { status: 500 })
  }
}
