import { createServerClient } from '@/lib/supabase/server-client'
import { createBrowserClient } from '@/lib/supabase/browser-client'
import type { Client, Supplier, Transitaire, Project, TrackingEvent, Message } from '@/types'

export class SupabaseService {
  private client: ReturnType<typeof createServerClient> | ReturnType<typeof createBrowserClient>

  constructor(isServer = true) {
    this.client = isServer ? createServerClient() : createBrowserClient()
  }

  // Clients
  async getClients(ownerId: string): Promise<Client[]> {
    const { data, error } = await this.client
      .from('clients')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch clients: ${error.message}`)
    return data || []
  }

  async getClient(id: string, ownerId: string): Promise<Client | null> {
    const { data, error } = await this.client
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch client: ${error.message}`)
    }
    return data
  }

  async createClient(data: Partial<Client>): Promise<Client> {
    const { data: client, error } = await this.client
      .from('clients')
      .insert(data)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create client: ${error.message}`)
    return client
  }

  async updateClient(id: string, ownerId: string, data: Partial<Client>): Promise<Client | null> {
    const { data: client, error } = await this.client
      .from('clients')
      .update(data)
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to update client: ${error.message}`)
    }
    return client
  }

  async deleteClient(id: string, ownerId: string): Promise<boolean> {
    const { error } = await this.client
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)
    
    if (error) throw new Error(`Failed to delete client: ${error.message}`)
    return true
  }

  // Suppliers
  async getSuppliers(ownerId: string): Promise<Supplier[]> {
    const { data, error } = await this.client
      .from('suppliers')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch suppliers: ${error.message}`)
    return data || []
  }

  async getSupplier(id: string, ownerId: string): Promise<Supplier | null> {
    const { data, error } = await this.client
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch supplier: ${error.message}`)
    }
    return data
  }

  async createSupplier(data: Partial<Supplier>): Promise<Supplier> {
    const { data: supplier, error } = await this.client
      .from('suppliers')
      .insert(data)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create supplier: ${error.message}`)
    return supplier
  }

  async updateSupplier(id: string, ownerId: string, data: Partial<Supplier>): Promise<Supplier | null> {
    const { data: supplier, error } = await this.client
      .from('suppliers')
      .update(data)
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to update supplier: ${error.message}`)
    }
    return supplier
  }

  async deleteSupplier(id: string, ownerId: string): Promise<boolean> {
    const { error } = await this.client
      .from('suppliers')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)
    
    if (error) throw new Error(`Failed to delete supplier: ${error.message}`)
    return true
  }

  // Transitaires
  async getTransitaires(ownerId: string): Promise<Transitaire[]> {
    const { data, error } = await this.client
      .from('transitaires')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch transitaires: ${error.message}`)
    return data || []
  }

  async getTransitaire(id: string, ownerId: string): Promise<Transitaire | null> {
    const { data, error } = await this.client
      .from('transitaires')
      .select('*')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch transitaire: ${error.message}`)
    }
    return data
  }

  async createTransitaire(data: Partial<Transitaire>): Promise<Transitaire> {
    const { data: transitaire, error } = await this.client
      .from('transitaires')
      .insert(data)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create transitaire: ${error.message}`)
    return transitaire
  }

  async updateTransitaire(id: string, ownerId: string, data: Partial<Transitaire>): Promise<Transitaire | null> {
    const { data: transitaire, error } = await this.client
      .from('transitaires')
      .update(data)
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to update transitaire: ${error.message}`)
    }
    return transitaire
  }

  async deleteTransitaire(id: string, ownerId: string): Promise<boolean> {
    const { error } = await this.client
      .from('transitaires')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)
    
    if (error) throw new Error(`Failed to delete transitaire: ${error.message}`)
    return true
  }

  // Projects
  async getProjects(ownerId: string): Promise<Project[]> {
    const { data, error } = await this.client
      .from('projects')
      .select('*, clients(*), suppliers(*), transitaires(*)')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch projects: ${error.message}`)
    return data || []
  }

  async getProject(id: string, ownerId: string): Promise<Project | null> {
    const { data, error } = await this.client
      .from('projects')
      .select('*, clients(*), suppliers(*), transitaires(*)')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch project: ${error.message}`)
    }
    return data
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    const { data: project, error } = await this.client
      .from('projects')
      .insert(data)
      .select('*, clients(*), suppliers(*), transitaires(*)')
      .single()
    
    if (error) throw new Error(`Failed to create project: ${error.message}`)
    return project
  }

  async updateProject(id: string, ownerId: string, data: Partial<Project>): Promise<Project | null> {
    const { data: project, error } = await this.client
      .from('projects')
      .update(data)
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select('*, clients(*), suppliers(*), transitaires(*)')
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to update project: ${error.message}`)
    }
    return project
  }

  async deleteProject(id: string, ownerId: string): Promise<boolean> {
    // Delete related tracking events first
    await this.client.from('tracking_events').delete().eq('project_id', id).eq('owner_id', ownerId)
    // Delete related project images
    await this.client.from('project_images').delete().eq('project_id', id)
    
    const { error } = await this.client
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)
    
    if (error) throw new Error(`Failed to delete project: ${error.message}`)
    return true
  }

  // Tracking Events
  async getTrackingEvents(projectId: string, ownerId: string): Promise<TrackingEvent[]> {
    const { data, error } = await this.client
      .from('tracking_events')
      .select('*')
      .eq('project_id', projectId)
      .eq('owner_id', ownerId)
      .order('event_date', { ascending: true })
    
    if (error) throw new Error(`Failed to fetch tracking events: ${error.message}`)
    return data || []
  }

  async createTrackingEvent(data: Partial<TrackingEvent>): Promise<TrackingEvent> {
    const { data: event, error } = await this.client
      .from('tracking_events')
      .insert(data)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create tracking event: ${error.message}`)
    return event
  }

  async updateTrackingEvent(id: string, ownerId: string, data: Partial<TrackingEvent>): Promise<TrackingEvent | null> {
    const { data: event, error } = await this.client
      .from('tracking_events')
      .update(data)
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to update tracking event: ${error.message}`)
    }
    return event
  }

  async deleteTrackingEvent(id: string, ownerId: string): Promise<boolean> {
    const { error } = await this.client
      .from('tracking_events')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)
    
    if (error) throw new Error(`Failed to delete tracking event: ${error.message}`)
    return true
  }

  // Messages
  async getMessages(ownerId: string, supplierId?: string): Promise<Message[]> {
    let query = this.client.from('messages').select('*').eq('owner_id', ownerId)
    
    if (supplierId) {
      query = query.eq('supplier_id', supplierId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: true })
    
    if (error) throw new Error(`Failed to fetch messages: ${error.message}`)
    return data || []
  }

  async createMessage(data: Partial<Message>): Promise<Message> {
    const { data: message, error } = await this.client
      .from('messages')
      .insert(data)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create message: ${error.message}`)
    return message
  }

  async updateMessage(id: string, ownerId: string, data: Partial<Message>): Promise<Message | null> {
    const { data: message, error } = await this.client
      .from('messages')
      .update(data)
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to update message: ${error.message}`)
    }
    return message
  }

  async deleteMessage(id: string, ownerId: string): Promise<boolean> {
    const { error } = await this.client
      .from('messages')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)
    
    if (error) throw new Error(`Failed to delete message: ${error.message}`)
    return true
  }

  // Dashboard stats
  async getDashboardStats(ownerId: string): Promise<{
    activeClients: number
    activeProjects: number
    totalMargin: number
    pendingMessages: number
  }> {
    const [clientsRes, projectsRes, messagesRes] = await Promise.all([
      this.client.from('clients').select('id', { count: 'exact', head: true }).eq('owner_id', ownerId),
      this.client.from('projects').select('margin', { count: 'exact', head: true }).eq('owner_id', ownerId).neq('status', 'annule'),
      this.client.from('projects').select('margin').eq('owner_id', ownerId).neq('status', 'annule'),
    ])

    const activeClients = clientsRes.count || 0
    const activeProjects = projectsRes.count || 0
    const totalMargin = (projectsRes.data as { margin: number }[] || []).reduce((sum, p) => sum + (p.margin || 0), 0)
    const pendingMessages = messagesRes.count || 0

    return { activeClients, activeProjects, totalMargin, pendingMessages }
  }
}
