import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server-client'
import { createError, handleApiError, validationError } from '@/lib/api/error-handler'
import type { ClientOrder } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')

    if (!agentId) {
      const error = validationError('agentId', 'ID de l\'agent est requis')
      return NextResponse.json({ error }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('client_orders')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      const apiError = createError('Erreur lors de la récupération des commandes', 'FETCH_FAILED', error.message)
      return NextResponse.json({ error: apiError }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Unexpected error:', error)
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    if (!body.id || !body.agent_id) {
      const error = validationError('id', 'ID de la commande et ID de l\'agent sont requis')
      return NextResponse.json({ error }, { status: 400 })
    }

    const updateData: Partial<ClientOrder> = {
      status: body.status,
    }

    const { data, error } = await supabase
      .from('client_orders')
      .update(updateData)
      .eq('id', body.id)
      .eq('agent_id', body.agent_id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      const apiError = createError('Erreur lors de la mise à jour', 'UPDATE_FAILED', error.message)
      return NextResponse.json({ error: apiError }, { status: 500 })
    }

    if (!data) {
      const error = createError('Commande non trouvée', 'ORDER_NOT_FOUND')
      return NextResponse.json({ error }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Unexpected error:', error)
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const agentId = searchParams.get('agentId')

    if (!id || !agentId) {
      const error = validationError('id', 'ID de la commande et ID de l\'agent sont requis')
      return NextResponse.json({ error }, { status: 400 })
    }

    // Get order to delete the associated file
    const { data: order, error: fetchError } = await supabase
      .from('client_orders')
      .select('payment_proof_url')
      .eq('id', id)
      .eq('agent_id', agentId)
      .single()

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      const apiError = createError('Commande non trouvée', 'ORDER_NOT_FOUND')
      return NextResponse.json({ error: apiError }, { status: 404 })
    }

    // Delete file from storage
    if (order.payment_proof_url) {
      const fileName = order.payment_proof_url.split('/').pop()
      if (fileName) {
        await supabase.storage.from('payment-proofs').remove([fileName])
      }
    }

    // Delete order
    const { error } = await supabase
      .from('client_orders')
      .delete()
      .eq('id', id)
      .eq('agent_id', agentId)

    if (error) {
      console.error('Delete error:', error)
      const apiError = createError('Erreur lors de la suppression', 'DELETE_FAILED', error.message)
      return NextResponse.json({ error: apiError }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError }, { status: 500 })
  }
}
