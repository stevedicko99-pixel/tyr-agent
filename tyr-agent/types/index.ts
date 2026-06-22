// Types de base pour l'application Tyr Agent

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: 'agent' | 'admin'
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  owner_id: string
  name: string
  email: string | null
  phone: string | null
  country: string
  city: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  owner_id: string
  name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  wechat: string | null
  alibaba_url: string | null
  address: string | null
  city: string | null
  country: string | null
  notes: string | null
  rating: number | null
  source: 'agent' | 'importateur'
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Transitaire {
  id: string
  owner_id: string
  name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  wechat: string | null
  address: string | null
  city: string | null
  country: string | null
  notes: string | null
  source: 'agent' | 'importateur'
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  owner_id: string
  client_id: string | null
  supplier_id: string | null
  transitaire_id: string | null
  title: string
  description: string | null
  status: ProjectStatus
  // Financial fields
  purchase_price: number
  quantity: number
  shipping_cost: number
  customs_duty: number
  selling_price: number
  currency: string
  // Computed
  total_cost: number
  margin: number
  margin_rate: number
  // Dates
  created_at: string
  updated_at: string
  // Relations
  client?: Client
  supplier?: Supplier
  transitaire?: Transitaire
}

export type ProjectStatus = 
  | 'draft'
  | 'en_negociation'
  | 'commande_passee'
  | 'en_production'
  | 'pret_expedition'
  | 'en_transit'
  | 'arrive'
  | 'livre'
  | 'annule'

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: 'Brouillon',
  en_negociation: 'En négociation',
  commande_passee: 'Commande passée',
  en_production: 'En production',
  pret_expedition: 'Prêt pour expédition',
  en_transit: 'En transit',
  arrive: 'Arrivé',
  livre: 'Livré',
  annule: 'Annulé',
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  en_negociation: 'bg-yellow-100 text-yellow-800',
  commande_passee: 'bg-blue-100 text-blue-800',
  en_production: 'bg-purple-100 text-purple-800',
  pret_expedition: 'bg-indigo-100 text-indigo-800',
  en_transit: 'bg-cyan-100 text-cyan-800',
  arrive: 'bg-teal-100 text-teal-800',
  livre: 'bg-green-100 text-green-800',
  annule: 'bg-red-100 text-red-800',
}

export interface ProjectImage {
  id: string
  project_id: string
  url: string
  caption: string | null
  order: number
  created_at: string
}

export interface TrackingEvent {
  id: string
  project_id: string
  owner_id: string
  title: string
  description: string | null
  event_date: string
  photo_url: string | null
  created_at: string
}

export interface Message {
  id: string
  owner_id: string
  supplier_id: string
  sender_id: string | null
  recipient_id: string | null
  body_fr: string
  body_zh: string | null
  direction: 'sent' | 'received'
  read: boolean
  created_at: string
}

export interface Conversation {
  supplier_id: string
  supplier: Supplier
  last_message: string
  last_message_at: string
  unread_count: number
}

export interface DashboardStats {
  activeClients: number
  activeProjects: number
  totalMargin: number
  pendingMessages: number
}

// Form types
export interface ProjectFormData {
  // Client info
  client_name: string
  client_email: string
  client_phone: string
  client_country: string
  client_city: string
  // Product info
  product_description: string
  product_category: string
  product_quantity: number
  product_budget: number
  // Destination
  destination_country: string
  destination_city: string
  // Supplier
  supplier_id: string | null
  // Financial
  purchase_price: number
  shipping_cost: number
  selling_price: number
  currency: string
}

// Categories for customs calculation
export const PRODUCT_CATEGORIES = [
  { value: 'electronics', label: 'Électronique', duty_rate: 0.18 },
  { value: 'textiles', label: 'Textiles', duty_rate: 0.12 },
  { value: 'household', label: 'Articles ménagers', duty_rate: 0.15 },
  { value: 'cosmetics', label: 'Cosmétiques', duty_rate: 0.20 },
  { value: 'food', label: 'Alimentaire', duty_rate: 0.25 },
  { value: 'toys', label: 'Jouets', duty_rate: 0.10 },
  { value: 'machinery', label: 'Machines', duty_rate: 0.08 },
  { value: 'other', label: 'Autre', duty_rate: 0.15 },
]

export const AFRICAN_COUNTRIES = [
  'Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso', 'Guinée',
  'Cameroun', 'Togo', 'Bénin', 'Niger', 'Nigeria', 'Ghana',
  'Afrique du Sud', 'Maroc', 'Tunisie', 'Égypte', 'Autres'
]

export const CURRENCIES = ['EUR', 'USD', 'CNY', 'XOF', 'CDF']

// Client Orders
export type ClientOrderStatus = 'pending' | 'accepted' | 'rejected' | 'converted'

export interface ClientOrder {
  id: string
  agent_id: string
  product_description: string
  notes: string | null
  budget: number | null
  client_name: string
  client_contact: string
  payment_proof_url: string
  status: ClientOrderStatus
  created_at: string
}

export const CLIENT_ORDER_STATUS_LABELS: Record<ClientOrderStatus, string> = {
  pending: 'En attente',
  accepted: 'Acceptée',
  rejected: 'Rejetée',
  converted: 'Convertie',
}

export const CLIENT_ORDER_STATUS_COLORS: Record<ClientOrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  converted: 'bg-blue-100 text-blue-800',
}