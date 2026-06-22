import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server-client'
import type { Message, Conversation } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    const supplierId = searchParams.get('supplierId')

    if (!ownerId) {
      return NextResponse.json({ error: 'ownerId est requis' }, { status: 400 })
    }

    if (supplierId) {
      // Get messages for a specific supplier
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('owner_id', ownerId)
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: 'Erreur lors de la récupération des messages' }, { status: 500 })
      }

      return NextResponse.json(data)
    } else {
      // Get conversations list
      const { data, error } = await supabase
        .from('messages')
        .select('supplier_id, body_fr, body_zh, direction, created_at')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: 'Erreur lors de la récupération des conversations' }, { status: 500 })
      }

      // Group by supplier_id and get last message
      const conversations: Record<string, Conversation> = {}
      
      for (const msg of data) {
        if (!conversations[msg.supplier_id]) {
          // Get supplier info
          const { data: supplierData } = await supabase
            .from('suppliers')
            .select('*')
            .eq('id', msg.supplier_id)
            .single()

          conversations[msg.supplier_id] = {
            supplier_id: msg.supplier_id,
            supplier: supplierData || { id: msg.supplier_id, name: 'Unknown' } as any,
            last_message: msg.body_fr || msg.body_zh || '',
            last_message_at: msg.created_at,
            unread_count: 0,
          }
        }
      }

      return NextResponse.json(Object.values(conversations))
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    if (!body.owner_id || !body.supplier_id || !body.body_fr) {
      return NextResponse.json({ error: 'owner_id, supplier_id et body_fr sont requis' }, { status: 400 })
    }

    const messageData: Partial<Message> = {
      owner_id: body.owner_id,
      supplier_id: body.supplier_id,
      sender_id: body.sender_id || null,
      recipient_id: body.recipient_id || null,
      body_fr: body.body_fr,
      body_zh: body.body_zh || null,
      direction: body.direction || 'sent',
      read: body.read || true,
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la création du message' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    if (!body.id || !body.owner_id) {
      return NextResponse.json({ error: 'id et owner_id sont requis' }, { status: 400 })
    }

    const updateData: Partial<Message> = {
      read: body.read,
      body_fr: body.body_fr,
      body_zh: body.body_zh,
    }

    const { data, error } = await supabase
      .from('messages')
      .update(updateData)
      .eq('id', body.id)
      .eq('owner_id', body.owner_id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour du message' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Message non trouvé' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const ownerId = searchParams.get('ownerId')

    if (!id || !ownerId) {
      return NextResponse.json({ error: 'id et ownerId sont requis' }, { status: 400 })
    }

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression du message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
