'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  PackageIcon, 
  MapPin, 
  Building2,
  Check,
  Plus,
  X
} from '@/components/icons'
import { Supplier, AFRICAN_COUNTRIES, PRODUCT_CATEGORIES, CURRENCIES } from '@/types'
import toast from 'react-hot-toast'

const steps = [
  { id: 'client', label: 'Client', icon: User },
  { id: 'product', label: 'Produit', icon: PackageIcon },
  { id: 'destination', label: 'Destination', icon: MapPin },
  { id: 'supplier', label: 'Fournisseur', icon: Building2 },
]

// Mock suppliers for selection
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    owner_id: 'demo',
    name: 'Shenzhen Electronics Co.',
    contact_name: 'M. Wang',
    email: null,
    phone: null,
    wechat: null,
    alibaba_url: null,
    address: null,
    city: 'Shenzhen',
    country: 'Chine',
    notes: null,
    rating: null,
    source: 'agent',
    is_verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    owner_id: 'demo',
    name: 'Guangzhou Textiles Ltd',
    contact_name: 'Mme. Li',
    email: null,
    phone: null,
    wechat: null,
    alibaba_url: null,
    address: null,
    city: 'Guangzhou',
    country: 'Chine',
    notes: null,
    rating: null,
    source: 'agent',
    is_verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function NewProjectPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [showAddSupplier, setShowAddSupplier] = useState(false)
  
  const [formData, setFormData] = useState({
    // Client
    client_name: '',
    client_email: '',
    client_phone: '',
    client_country: '',
    client_city: '',
    // Product
    product_description: '',
    product_category: 'electronics',
    product_quantity: 1,
    product_budget: 0,
    // Destination
    destination_country: '',
    destination_city: '',
    // Supplier
    supplier_id: '',
    // Financial
    purchase_price: 0,
    shipping_cost: 0,
    selling_price: 0,
    currency: 'EUR',
  })

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    // Validation basique
    if (!formData.client_name) {
      toast.error('Veuillez renseigner le nom du client')
      setCurrentStep(0)
      return
    }
    if (!formData.product_description) {
      toast.error('Veuillez renseigner la description du produit')
      setCurrentStep(1)
      return
    }

    // Simuler la création
    toast.success('Projet créé avec succès')
    router.push('/projects')
  }

  const selectedSupplier = mockSuppliers.find(s => s.id === formData.supplier_id)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-tyr-navy">Nouveau projet</h1>
          <p className="text-gray-500 text-sm">Créer une nouvelle importation</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep
          const isCompleted = index < currentStep

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-tyr-navy text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    isActive ? 'text-tyr-navy font-medium' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-20 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Client */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-tyr-navy mb-4">
                Informations du client
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du client *
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => updateField('client_name', e.target.value)}
                  placeholder="Nom complet ou raison sociale"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => updateField('client_email', e.target.value)}
                    placeholder="email@exemple.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.client_phone}
                    onChange={(e) => updateField('client_phone', e.target.value)}
                    placeholder="+221 XX XXX XX XX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <select
                    value={formData.client_country}
                    onChange={(e) => updateField('client_country', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="">Sélectionner un pays</option>
                    {AFRICAN_COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.client_city}
                    onChange={(e) => updateField('client_city', e.target.value)}
                    placeholder="Dakar"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Product */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-tyr-navy mb-4">
                Détails du produit
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description du produit *
                </label>
                <textarea
                  value={formData.product_description}
                  onChange={(e) => updateField('product_description', e.target.value)}
                  placeholder="Décrivez le produit à importer..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={formData.product_category}
                  onChange={(e) => updateField('product_category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none appearance-none bg-white"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    value={formData.product_quantity}
                    onChange={(e) => updateField('product_quantity', parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget client
                  </label>
                  <input
                    type="number"
                    value={formData.product_budget}
                    onChange={(e) => updateField('product_budget', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Destination */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-tyr-navy mb-4">
                Destination de livraison
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays de destination
                </label>
                <select
                  value={formData.destination_country}
                  onChange={(e) => updateField('destination_country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value="">Sélectionner un pays</option>
                  {AFRICAN_COUNTRIES.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville de destination
                </label>
                <input
                  type="text"
                  value={formData.destination_city}
                  onChange={(e) => updateField('destination_city', e.target.value)}
                  placeholder="Ex: Dakar, Abidjan, Douala..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 4: Supplier */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-tyr-navy mb-4">
                Fournisseur (optionnel)
              </h2>
              
              <p className="text-sm text-gray-500 mb-4">
                Sélectionnez un fournisseur depuis votre carnet d&apos;adresses ou sautez cette étape.
              </p>

              <div className="space-y-2">
                {mockSuppliers.map((supplier) => (
                  <button
                    key={supplier.id}
                    onClick={() => updateField('supplier_id', supplier.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      formData.supplier_id === supplier.id
                        ? 'border-tyr-orange bg-tyr-orange/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-tyr-navy">{supplier.name}</p>
                        <p className="text-sm text-gray-500">{supplier.contact_name} • {supplier.city}</p>
                      </div>
                      {formData.supplier_id === supplier.id && (
                        <div className="w-6 h-6 bg-tyr-orange rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => router.push('/address-book')}
                className="flex items-center gap-2 text-sm text-tyr-orange hover:text-tyr-orange/80"
              >
                <Plus className="w-4 h-4" />
                Ajouter un nouveau fournisseur
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </button>
        
        {currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 bg-tyr-navy text-white rounded-lg hover:bg-tyr-navy/90 transition-colors"
          >
            Suivant
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            Créer le projet
          </button>
        )}
      </div>
    </div>
  )
}