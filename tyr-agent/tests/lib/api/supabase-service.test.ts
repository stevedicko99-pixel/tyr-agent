import { SupabaseService } from '@/lib/api/supabase-service'

// Mock supabase client
jest.mock('@/lib/supabase/server-client', () => ({
  createServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: {}, error: null }),
      head: jest.fn().mockReturnThis(),
      count: jest.fn().mockReturnThis(),
    })),
  })),
}))

describe('SupabaseService', () => {
  let service: SupabaseService

  beforeEach(() => {
    service = new SupabaseService()
  })

  describe('getClients', () => {
    it('should return clients for a given owner', async () => {
      const mockClients = [{ id: '1', name: 'Client 1', owner_id: 'owner1' }]
      
      const mockFrom = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockClients, error: null }),
      }))
      
      jest.mocked(require('@/lib/supabase/server-client').createServerClient).mockReturnValue({
        from: mockFrom,
      } as any)
      
      service = new SupabaseService()
      const clients = await service.getClients('owner1')
      
      expect(clients).toEqual(mockClients)
    })
  })

  describe('createClient', () => {
    it('should create a new client', async () => {
      const mockClient = { id: '1', name: 'New Client', owner_id: 'owner1' }
      
      const mockFrom = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockClient, error: null }),
      }))
      
      jest.mocked(require('@/lib/supabase/server-client').createServerClient).mockReturnValue({
        from: mockFrom,
      } as any)
      
      service = new SupabaseService()
      const client = await service.createClient({ name: 'New Client', owner_id: 'owner1' })
      
      expect(client).toEqual(mockClient)
    })
  })

  describe('getDashboardStats', () => {
    it('should return dashboard stats', async () => {
      const mockFrom = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        neq: jest.fn().mockReturnThis(),
        head: jest.fn().mockReturnThis(),
        count: jest.fn().mockResolvedValue({ count: 5, data: [], error: null }),
      }))
      
      jest.mocked(require('@/lib/supabase/server-client').createServerClient).mockReturnValue({
        from: mockFrom,
      } as any)
      
      service = new SupabaseService()
      const stats = await service.getDashboardStats('owner1')
      
      expect(stats.activeClients).toBeDefined()
      expect(stats.activeProjects).toBeDefined()
      expect(stats.totalMargin).toBeDefined()
      expect(stats.pendingMessages).toBeDefined()
    })
  })
})
