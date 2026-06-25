'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FolderKanban, 
  Search, 
  ArrowRightCircle,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock
} from '@/components/icons'
import { Project, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/types'
import { format, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'

const mockProjects: Project[] = [
  {
    id: '1',
    owner_id: 'demo',
    client_id: '1',
    supplier_id: '1',
    transitaire_id: null,
    title: 'Import electronique - Client Diallo',
    description: 'Smartphones et accessoires',
    status: 'en_production',
    purchase_price: 2000,
    quantity: 50,
    shipping_cost: 300,
    customs_duty: 200,
    selling_price: 3200,
    currency: 'EUR',
    total_cost: 2500,
    margin: 700,
    margin_rate: 28,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    owner_id: 'demo',
    client_id: '2',
    supplier_id: '2',
    transitaire_id: null,
    title: 'Textiles ete - Boutique Senegal',
    description: 'Vetements homme et femme',
    status: 'en_transit',
    purchase_price: 1500,
    quantity: 100,
    shipping_cost: 200,
    customs_duty: 100,
    selling_price: 2400,
    currency: 'EUR',
    total_cost: 1800,
    margin: 600,
    margin_rate: 33,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    owner_id: 'demo',
    client_id: '3',
    supplier_id: null,
    transitaire_id: null,
    title: 'Electromenager - Cameroun',
    description: 'Refrigerateurs et climatiseurs',
    status: 'commande_passee',
    purchase_price: 3500,
    quantity: 10,
    shipping_cost: 400,
    customs_duty: 300,
    selling_price: 5500,
    currency: 'EUR',
    total_cost: 4200,
    margin: 1300,
    margin_rate: 31,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    owner_id: 'demo',
    client_id: '4',
    supplier_id: null,
    transitaire_id: null,
    title: 'Jouets enfants - Abidjan',
    description: 'Jouets educatifs',
    status: 'livre',
    purchase_price: 600,
    quantity: 200,
    shipping_cost: 100,
    customs_duty: 100,
    selling_price: 1200,
    currency: 'EUR',
    total_cost: 800,
    margin: 400,
    margin_rate: 50,
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString(),
  },
]

const statusFilters = [
  { value: 'all', label: 'Tous' },
  { value: 'en_negociation', label: 'En negociation' },
  { value: 'commande_passee', label: 'Commande passee' },
  { value: 'en_production', label: 'En production' },
  { value: 'pret_expedition', label: 'Pret pour expedition' },
  { value: 'en_transit', label: 'En transit' },
  { value: 'arrive', label: 'Arrive' },
  { value: 'livre', label: 'Livre' },
  { value: 'annule', label: 'Annule' },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projects] = useState<Project[]>(mockProjects)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (date: string) => {
    const d = new Date(date)
    if (isToday(d)) return 'Aujourd\'hui'
    if (isYesterday(d)) return 'Hier'
    return format(d, 'd MMM', { locale: fr })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-tyr-navy">Projets</h1>
          <p className="text-gray-500 text-sm mt-1">Suivez vos importations en cours</p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-tyr-navy text-white rounded-lg hover:bg-tyr-navy/90 transition-colors"
        >
          <FolderKanban className="w-4 h-4" />
          Nouveau projet
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
        >
          {statusFilters.map(filter => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      {/* Projects */}
      <AnimatePresence mode="wait">
        {filteredProjects.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl p-8 text-center border border-gray-200"
          >
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun projet trouve</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-tyr-orange/50 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-tyr-navy truncate flex-1">{project.title}</h3>
                    <ArrowRightCircle className="w-5 h-5 text-gray-300 group-hover:text-tyr-orange transition-colors flex-shrink-0 ml-2" />
                  </div>

                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${PROJECT_STATUS_COLORS[project.status]}`}>
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(project.created_at)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Cout total
                      </p>
                      <p className="font-semibold text-tyr-navy">{project.total_cost} {project.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Marge
                      </p>
                      <p className="font-semibold text-green-600">+{project.margin} {project.currency}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
