import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server-client'
import type { TrackingEvent } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const ownerId = searchParams.get('ownerId')

    if (!projectId || !ownerId) {
      return NextResponse.json({ error: 'projectId et ownerId sont requis' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('tracking_events')
      .select('*')
      .eq('project_id', projectId)
      .eq('owner_id', ownerId)
      .order('event_date', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des événements de suivi' }, { status: 500 })
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

    if (!body.project_id || !body.owner_id || !body.title) {
      return NextResponse.json({ error: 'project_id, owner_id et title sont requis' }, { status: 400 })
    }

    const eventData: Partial<TrackingEvent> = {
      project_id: body.project_id,
      owner_id: body.owner_id,
      title: body.title,
      description: body.description || null,
      event_date: body.event_date || new Date().toISOString(),
      photo_url: body.photo_url || null,
    }

    const { data, error } = await supabase
      .from('tracking_events')
      .insert(eventData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la création de l\'événement' }, { status: 500 })
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

    const updateData: Partial<TrackingEvent> = {
      title: body.title,
      description: body.description,
      event_date: body.event_date,
      photo_url: body.photo_url,
    }

    const { data, error } = await supabase
      .from('tracking_events')
      .update(updateData)
      .eq('id', body.id)
      .eq('owner_id', body.owner_id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour de l\'événement' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 })
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
      .from('tracking_events')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression de l\'événement' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
