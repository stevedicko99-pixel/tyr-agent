import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server-client'
import type { Transitaire } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')

    if (!ownerId) {
      return NextResponse.json({ error: 'ownerId est requis' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('transitaires')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des transitaires' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    if (!body.owner_id || !body.name) {
      return NextResponse.json({ error: 'owner_id et name sont requis' }, { status: 400 })
    }

    const transitaireData: Partial<Transitaire> = {
      owner_id: body.owner_id,
      name: body.name,
      contact_name: body.contact_name || null,
      email: body.email || null,
      phone: body.phone || null,
      wechat: body.wechat || null,
      address: body.address || null,
      city: body.city || null,
      country: body.country || null,
      notes: body.notes || null,
      source: body.source || 'agent',
      is_verified: body.is_verified || false,
    }

    const { data, error } = await supabase
      .from('transitaires')
      .insert(transitaireData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la création du transitaire' }, { status: 500 })
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

    const updateData: Partial<Transitaire> = {
      name: body.name,
      contact_name: body.contact_name,
      email: body.email,
      phone: body.phone,
      wechat: body.wechat,
      address: body.address,
      city: body.city,
      country: body.country,
      notes: body.notes,
      is_verified: body.is_verified,
    }

    const { data, error } = await supabase
      .from('transitaires')
      .update(updateData)
      .eq('id', body.id)
      .eq('owner_id', body.owner_id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour du transitaire' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Transitaire non trouvé' }, { status: 404 })
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
      .from('transitaires')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression du transitaire' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
