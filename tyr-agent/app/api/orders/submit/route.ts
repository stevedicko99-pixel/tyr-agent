import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server-client'
import { createError, handleApiError, validationError } from '@/lib/api/error-handler'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Parse multipart form data
    const formData = await request.formData()
    
    const agentId = formData.get('agentId') as string
    const productDescription = formData.get('productDescription') as string
    const notes = formData.get('notes') as string | null
    const budget = formData.get('budget') as string | null
    const clientName = formData.get('clientName') as string
    const clientContact = formData.get('clientContact') as string
    const paymentProof = formData.get('paymentProof') as File | null

    // Validation
    if (!agentId) {
      const error = validationError('agentId', 'ID de l\'agent est requis')
      return NextResponse.json({ error }, { status: 400 })
    }

    if (!productDescription || productDescription.trim().length === 0) {
      const error = validationError('productDescription', 'Description du produit est requise')
      return NextResponse.json({ error }, { status: 400 })
    }

    if (!clientName || clientName.trim().length === 0) {
      const error = validationError('clientName', 'Nom du client est requis')
      return NextResponse.json({ error }, { status: 400 })
    }

    if (!clientContact || clientContact.trim().length === 0) {
      const error = validationError('clientContact', 'Contact du client est requis')
      return NextResponse.json({ error }, { status: 400 })
    }

    if (!paymentProof) {
      const error = validationError('paymentProof', 'Preuve de paiement est requise')
      return NextResponse.json({ error }, { status: 400 })
    }

    // Verify agent exists
    const { data: agent, error: agentError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', agentId)
      .single()

    if (agentError || !agent) {
      const error = createError('Agent non trouvÃ©', 'AGENT_NOT_FOUND')
      return NextResponse.json({ error }, { status: 404 })
    }

    // Validate file
    const maxFileSize = 5 * 1024 * 1024 // 5MB
    if (paymentProof.size > maxFileSize) {
      const error = validationError('paymentProof', 'Fichier trop volumineux (max 5 Mo)')
      return NextResponse.json({ error }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    if (!allowedTypes.includes(paymentProof.type)) {
      const error = validationError('paymentProof', 'Type de fichier non autorisÃ© (JPG, PNG, GIF, PDF)')
      return NextResponse.json({ error }, { status: 400 })
    }

    // Upload file to Supabase Storage
    const fileExtension = paymentProof.name.split('.').pop() || 'pdf'
    const fileName = `payment-proof-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('payment-proofs')
      .upload(fileName, paymentProof, {
        contentType: paymentProof.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      const error = createError('Ã‰chec de l\'upload', 'UPLOAD_FAILED', uploadError.message)
      return NextResponse.json({ error }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('payment-proofs')
      .getPublicUrl(fileName)

    if (!urlData || !urlData.publicUrl) {
      const error = createError('Failed to get public URL', 'URL_FAILED')
      return NextResponse.json({ error }, { status: 500 })
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('client_orders')
      .insert({
        agent_id: agentId,
        product_description: productDescription.trim(),
        notes: notes?.trim() || null,
        budget: budget ? parseFloat(budget) : null,
        client_name: clientName.trim(),
        client_contact: clientContact.trim(),
        payment_proof_url: urlData.publicUrl,
        status: 'pending' as const,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order error:', orderError)
      // Clean up uploaded file
      await supabase.storage.from('payment-proofs').remove([fileName])
      const error = createError('Ã‰chec de la crÃ©ation de la commande', 'ORDER_FAILED', orderError.message)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
        message: 'Commande soumise avec succÃ¨s. Nous vous contacterons bientÃ´t.',
      },
    }, { status: 201 })

  } catch (error) {
    console.error('Order submission error:', error)
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError }, { status: 500 })
  }
}
