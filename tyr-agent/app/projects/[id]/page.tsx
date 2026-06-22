'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ImageIcon,
  DollarSign,
  Calendar,
  User,
  Building2,
  Truck,
  CheckCircle2,
  Info,
  GalleryVerticalEnd,
  Route,
  Calculator,
  FileText,
  Share2,
  Plus,
  X,
  Upload
} from '@/components/icons'
import { Project, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, ProjectStatus, TrackingEvent } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { Timeline } from '@/components/Timeline'
import { MarginCalculator } from '@/components/MarginCalculator'

// Données mockées
const mockProject: Project = {
  id: '1',
  owner_id: 'demo',
  client_id: '1',
  supplier_id: '1',
  transitaire_id: '1',
  title: 'Import électronique - Client Diallo',
  description: 'Smartphones et accessoires mobiles pour la boutique de M. Diallo à Dakar. Commande de 50 unités mixtes.',
  status: 'en_production',
  purchase_price: 40,
  quantity: 50,
  shipping_cost: 500,
  customs_duty: 360,
  selling_price: 3200,
  currency: 'EUR',
  total_cost: 2360,
  margin: 700,
  margin_rate: 23,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  client: {
    id: '1',
    owner_id: 'demo',
    name: 'Mamadou Diallo',
    email: 'diallo@email.com',
    phone: '+221 77 123 45 67',
    country: 'Sénégal',
    city: 'Dakar',
    notes: 'Client régulier',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  supplier: {
    id: '1',
    owner_id: 'demo',
    name: 'Shenzhen Electronics Co.',
    contact_name: 'M. Wang',
    email: 'wang@sz-electronics.com',
    phone: '+86 138 1234 5678',
    wechat: 'wang_electronics',
    city: 'Shenzhen',
    source: 'agent',
    is_verified: false,
    rating: 4.5,
    notes: 'Fournisseur fiable',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  transitaire: {
    id: '1',
    owner_id: 'demo',
    name: 'FastShip Logistics',
    contact_name: 'M. Chen',
    email: 'chen@fastship.cn',
    phone: '+86 21 1234 5678',
    wechat: 'fastship_chen',
    notes: 'Spécialiste Afrique de l\'Ouest',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

const mockTrackingEvents: TrackingEvent[] = [
  {
    id: '1',
    project_id: '1',
    owner_id: 'demo',
    title: 'Commande confirmée',
    description: 'Le client a validé la commande et payé l\'acompte.',
    event_date: new Date(Date.now() - 604800000).toISOString(),
    photo_url: null,
    created_at: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: '2',
    project_id: '1',
    owner_id: 'demo',
    title: 'Production en cours',
    description: 'Le fournisseur a confirmé le début de la production.',
    event_date: new Date(Date.now() - 432000000).toISOString(),
    photo_url: null,
    created_at: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: '3',
    project_id: '1',
    owner_id: 'demo',
    title: 'Prêt pour expédition',
    description: 'Les marchandises sont emballées et prêtes.',
    event_date: new Date().toISOString(),
    photo_url: null,
    created_at: new Date().toISOString(),
  },
]

const tabs = [
  { id: 'info', label: 'Informations', icon: Info },
  { id: 'gallery', label: 'Galerie', icon: GalleryVerticalEnd },
  { id: 'tracking', label: 'Suivi', icon: Route },
  { id: 'margin', label: 'Marge', icon: Calculator },
]

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project] = useState<Project>(mockProject)
  const [activeTab, setActiveTab] = useState('info')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>(mockTrackingEvents)

  const handleStatusChange = (newStatus: ProjectStatus) => {
    toast.success(`Statut mis à jour: ${PROJECT_STATUS_LABELS[newStatus]}`)
  }

  const handleDelete = () => {
    toast.success('Projet supprimé')
    router.push('/projects')
  }

  const handleAddTrackingEvent = (event: Omit<TrackingEvent, 'id' | 'created_at'>) => {
    const newEvent: TrackingEvent = {
      ...event,
      id: Date.now().toString(),
      project_id: project.id,
      owner_id: project.owner_id,
      created_at: new Date().toISOString(),
    }
    setTrackingEvents([newEvent, ...trackingEvents])
  }

  const handleGenerateInvoice = () => {
    toast.success('Facture proforma générée (aperçu à implémenter)')
  }

  const handleShareGallery = () => {
    navigator.clipboard.writeText(`${window.location.origin}/gallery/${project.id}`)
    toast.success('Lien de la galerie copié !')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/projects"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-tyr-navy">{project.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full ${PROJECT_STATUS_COLORS[project.status]}`}>
              {PROJECT_STATUS_LABELS[project.status]}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Créé le {format(new Date(project.created_at), 'd MMMM yyyy', { locale: fr })}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-tyr-navy text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Tab: Informations */}
        {activeTab === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Financial Summary */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-tyr-navy">Récapitulatif financier</h2>
                <button
                  onClick={handleGenerateInvoice}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Facture proforma
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Coût total rendu</p>
                  <p className="font-bold text-tyr-navy">
                    {project.total_cost.toLocaleString('fr-FR')} {project.currency}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Prix de vente</p>
                  <p className="font-bold text-tyr-navy">
                    {project.selling_price.toLocaleString('fr-FR')} {project.currency}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-green-600 mb-1">Marge brute</p>
                  <p className="font-bold text-green-600">
                    {project.margin.toLocaleString('fr-FR')} {project.currency}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-green-600 mb-1">Taux de marge</p>
                  <p className="font-bold text-green-600">
                    {project.margin_rate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="font-semibold text-tyr-navy mb-3">Description</h2>
              <p className="text-gray-600">{project.description}</p>
            </div>

            {/* Contacts */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="font-semibold text-tyr-navy mb-4">Contacts</h2>
              <div className="space-y-4">
                {project.client && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-tyr-navy">{project.client.name}</p>
                      <p className="text-sm text-gray-500">Client • {project.client.city}, {project.client.country}</p>
                      {project.client.phone && (
                        <a href={`tel:${project.client.phone}`} className="text-sm text-tyr-orange hover:underline">
                          {project.client.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}
                {project.supplier && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-tyr-navy">{project.supplier.name}</p>
                      <p className="text-sm text-gray-500">Fournisseur • {project.supplier.city}</p>
                      {project.supplier.phone && (
                        <a href={`tel:${project.supplier.phone}`} className="text-sm text-tyr-orange hover:underline">
                          {project.supplier.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}
                {project.transitaire && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-tyr-navy">{project.transitaire.name}</p>
                      <p className="text-sm text-gray-500">Transitaire</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab: Galerie */}
        {activeTab === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-tyr-navy">Galerie photos</h2>
              <button
                onClick={handleShareGallery}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-tyr-orange text-white rounded-lg hover:bg-tyr-orange/90 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Partager la galerie
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-tyr-orange/50 transition-colors cursor-pointer group"
                >
                  <ImageIcon className="w-8 h-8 text-gray-300 group-hover:text-tyr-orange/50" />
                  <span className="text-xs text-gray-400 mt-2">Ajouter</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Les photos uploadées seront stockées dans Supabase Storage et associées à ce projet.
            </p>
          </motion.div>
        )}

        {/* Tab: Suivi */}
        {activeTab === 'tracking' && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <Timeline events={trackingEvents} onAddEvent={handleAddTrackingEvent} />
          </motion.div>
        )}

        {/* Tab: Marge */}
        {activeTab === 'margin' && (
          <motion.div
            key="margin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MarginCalculator
              initialValues={{
                purchasePrice: project.purchase_price,
                quantity: project.quantity,
                shippingCost: project.shipping_cost,
                sellingPrice: project.selling_price,
                currency: project.currency,
              }}
              onSave={(values) => {
                toast.success('Marge calculée et enregistrée')
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <h2 className="text-xl font-bold text-tyr-navy mb-2">Supprimer le projet</h2>
            <p className="text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}