import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server-client'
import type { Project } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    const id = searchParams.get('id')

    if (!ownerId && !id) {
      return NextResponse.json({ error: 'ownerId ou id est requis' }, { status: 400 })
    }

    let query = supabase.from('projects').select('*, clients(*), suppliers(*), transitaires(*)')

    if (id) {
      query = query.eq('id', id)
    } else {
      query = query.eq('owner_id', ownerId).order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des projets' }, { status: 500 })
    }

    return NextResponse.json(id ? data[0] : data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    if (!body.owner_id || !body.title) {
      return NextResponse.json({ error: 'owner_id et title sont requis' }, { status: 400 })
    }

    // Calculate total cost and margin
    const purchasePrice = body.purchase_price || 0
    const quantity = body.quantity || 1
    const shippingCost = body.shipping_cost || 0
    const customsDuty = body.customs_duty || 0
    const sellingPrice = body.selling_price || 0

    const totalCost = purchasePrice * quantity + shippingCost + customsDuty
    const margin = sellingPrice - totalCost
    const marginRate = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0

    const projectData: Partial<Project> = {
      owner_id: body.owner_id,
      client_id: body.client_id || null,
      supplier_id: body.supplier_id || null,
      transitaire_id: body.transitaire_id || null,
      title: body.title,
      description: body.description || null,
      status: body.status || 'draft',
      purchase_price: purchasePrice,
      quantity,
      shipping_cost: shippingCost,
      customs_duty: customsDuty,
      selling_price: sellingPrice,
      currency: body.currency || 'EUR',
      total_cost: totalCost,
      margin,
      margin_rate: marginRate,
    }

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select('*, clients(*), suppliers(*), transitaires(*)')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la création du projet' }, { status: 500 })
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

    // Calculate total cost and margin
    const purchasePrice = body.purchase_price || 0
    const quantity = body.quantity || 1
    const shippingCost = body.shipping_cost || 0
    const customsDuty = body.customs_duty || 0
    const sellingPrice = body.selling_price || 0

    const totalCost = purchasePrice * quantity + shippingCost + customsDuty
    const margin = sellingPrice - totalCost
    const marginRate = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0

    const updateData: Partial<Project> = {
      client_id: body.client_id,
      supplier_id: body.supplier_id,
      transitaire_id: body.transitaire_id,
      title: body.title,
      description: body.description,
      status: body.status,
      purchase_price: purchasePrice,
      quantity,
      shipping_cost: shippingCost,
      customs_duty: customsDuty,
      selling_price: sellingPrice,
      currency: body.currency,
      total_cost: totalCost,
      margin,
      margin_rate: marginRate,
    }

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', body.id)
      .eq('owner_id', body.owner_id)
      .select('*, clients(*), suppliers(*), transitaires(*)')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour du projet' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
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

    // Delete related tracking events first
    await supabase.from('tracking_events').delete().eq('project_id', id).eq('owner_id', ownerId)
    
    // Delete related project images
    await supabase.from('project_images').delete().eq('project_id', id)

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression du projet' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
