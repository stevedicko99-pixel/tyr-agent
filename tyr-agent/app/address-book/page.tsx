'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Building2, 
  Truck, 
  Phone, 
  Mail, 
  MessageCircle,
  Star,
  MoreVertical,
  X,
  Shield,
  Globe
} from '@/components/icons'
import { Supplier, Transitaire } from '@/types'
import toast from 'react-hot-toast'

// DonnÃ©es mockÃ©es avec les nouveaux champs
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    owner_id: 'demo',
    name: 'Shenzhen Electronics Co.',
    contact_name: 'M. Wang',
    email: 'wang@sz-electronics.com',
    phone: '+86 138 1234 5678',
    wechat: 'wang_electronics',
    alibaba_url: 'https://alibaba.com/supplier/1',
    address: null,
    city: 'Shenzhen',
    country: 'Chine',
    rating: 4.5,
    source: 'agent',
    is_verified: false,
    notes: 'Fournisseur fiable pour electronique',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    owner_id: 'demo',
    name: 'Guangzhou Textiles Ltd',
    contact_name: 'Mme. Li',
    email: 'li@gz-textiles.com',
    phone: '+86 139 8765 4321',
    wechat: 'li_textiles',
    alibaba_url: null,
    address: null,
    city: 'Guangzhou',
    country: 'Chine',
    rating: 4,
    source: 'agent',
    is_verified: true,
    notes: 'Bon rapport qualite/prix',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockTransitaires: Transitaire[] = [
  {
    id: '1',
    owner_id: 'demo',
    name: 'FastShip Logistics',
    contact_name: 'M. Chen',
    email: 'chen@fastship.cn',
    phone: '+86 21 1234 5678',
    wechat: 'fastship_chen',
    address: 'Shanghai Port Zone',
    city: 'Shanghai',
    country: 'Chine',
    source: 'agent',
    is_verified: false,
    notes: 'SpÃ©cialiste Afrique de l\'Ouest',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

type Tab = 'suppliers' | 'transitaires'

export default function AddressBookPage() {
  const [activeTab, setActiveTab] = useState<Tab>('suppliers')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [suppliers] = useState<Supplier[]>(mockSuppliers)
  const [transitaires] = useState<Transitaire[]>(mockTransitaires)

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTransitaires = transitaires.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.contact_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-tyr-navy">Carnet d&apos;adresses</h1>
          <p className="text-gray-500 text-sm mt-1">GÃ©rez vos fournisseurs et transitaires</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-tyr-navy text-white rounded-lg hover:bg-tyr-navy/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'suppliers'
              ? 'bg-tyr-navy text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Fournisseurs ({suppliers.length})
        </button>
        <button
          onClick={() => setActiveTab('transitaires')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'transitaires'
              ? 'bg-tyr-navy text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          Transitaires ({transitaires.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'suppliers' ? (
          <motion.div
            key="suppliers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {filteredSuppliers.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun fournisseur trouvÃ©</p>
              </div>
            ) : (
              filteredSuppliers.map((supplier) => (
                <motion.div
                  key={supplier.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-tyr-orange/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-tyr-navy">{supplier.name}</h3>
                        {supplier.is_verified ? (
                          <Shield className="w-4 h-4 text-green-500" title="VÃ©rifiÃ©" />
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">Non vÃ©rifiÃ©</span>
                        )}
                        {supplier.source === 'importateur' && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Importateur
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{supplier.contact_name} â€¢ {supplier.city}, {supplier.country}</p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        {supplier.rating && renderStars(supplier.rating)}
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-3">
                        {supplier.phone && (
                          <a
                            href={`tel:${supplier.phone}`}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-tyr-orange"
                          >
                            <Phone className="w-4 h-4" />
                            {supplier.phone}
                          </a>
                        )}
                        {supplier.email && (
                          <a
                            href={`mailto:${supplier.email}`}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-tyr-orange"
                          >
                            <Mail className="w-4 h-4" />
                            {supplier.email}
                          </a>
                        )}
                        {supplier.wechat && (
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <MessageCircle className="w-4 h-4" />
                            {supplier.wechat}
                          </span>
                        )}
                      </div>
                      
                      {supplier.notes && (
                        <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                          {supplier.notes}
                        </p>
                      )}
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="transitaires"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {filteredTransitaires.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun transitaire trouvÃ©</p>
              </div>
            ) : (
              filteredTransitaires.map((transitaire) => (
                <motion.div
                  key={transitaire.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-tyr-orange/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-tyr-navy">{transitaire.name}</h3>
                        {transitaire.is_verified ? (
                          <Shield className="w-4 h-4 text-green-500" title="VÃ©rifiÃ©" />
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">Non vÃ©rifiÃ©</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{transitaire.contact_name} â€¢ {transitaire.city}, {transitaire.country}</p>
                      
                      <div className="flex flex-wrap gap-3 mt-3">
                        {transitaire.phone && (
                          <a
                            href={`tel:${transitaire.phone}`}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-tyr-orange"
                          >
                            <Phone className="w-4 h-4" />
                            {transitaire.phone}
                          </a>
                        )}
                        {transitaire.email && (
                          <a
                            href={`mailto:${transitaire.email}`}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-tyr-orange"
                          >
                            <Mail className="w-4 h-4" />
                            {transitaire.email}
                          </a>
                        )}
                        {transitaire.wechat && (
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <MessageCircle className="w-4 h-4" />
                            {transitaire.wechat}
                          </span>
                        )}
                      </div>
                      
                      {transitaire.notes && (
                        <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                          {transitaire.notes}
                        </p>
                      )}
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-tyr-navy">
                  Ajouter un {activeTab === 'suppliers' ? 'fournisseur' : 'transitaire'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault()
                toast.success('Contact ajoutÃ© avec succÃ¨s (source: agent, non vÃ©rifiÃ©)')
                setShowAddModal(false)
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l&apos;entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du contact
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      TÃ©lÃ©phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WeChat
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {activeTab === 'suppliers' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lien Alibaba
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg">
                  <p>Ce contact sera crÃ©Ã© avec :</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>source: &apos;agent&apos;</li>
                    <li>is_verified: false</li>
                    <li>owner_id: votre ID d&apos;agent</li>
                  </ul>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-tyr-navy text-white rounded-lg hover:bg-tyr-navy/90 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}