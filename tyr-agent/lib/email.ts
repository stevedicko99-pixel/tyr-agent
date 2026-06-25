import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  user: string
  password: string
  from: string
}

const getEmailConfig = (): EmailConfig => {
  return {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@tyragent.com'
  }
}

const transporter = nodemailer.createTransport({
  host: getEmailConfig().host,
  port: getEmailConfig().port,
  secure: getEmailConfig().port === 465,
  auth: {
    user: getEmailConfig().user,
    pass: getEmailConfig().password
  }
})

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  attachments?: {
    filename: string
    path?: string
    content?: string
    contentType?: string
  }[]
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; message: string; error?: string }> {
  const config = getEmailConfig()
  
  if (!config.user || !config.password) {
    console.warn('Email service not configured')
    return {
      success: false,
      message: 'Email service not configured',
      error: 'Please configure EMAIL_USER and EMAIL_PASSWORD environment variables'
    }
  }

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: options.to,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>/g, ' '),
      html: options.html,
      attachments: options.attachments
    })

    console.log('Email sent successfully:', info.messageId)
    return {
      success: true,
      message: `Email sent successfully (${info.messageId})`
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify()
    return true
  } catch {
    return false
  }
}
