'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter,
  FolderKanban,
  ArrowRight
} from '@/components/icons'
import { Project, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Données mockées
const mockProjects: Project[] = [
  {
    id: '1',
    owner_id: 'demo',
    client_id: '1',
    supplier_id: '1',
    title: 'Import électronique - Client Diallo',
    description: 'Smartphones et accessoires',
    status: 'en_production',
    total_cost: 2500,
    selling_price: 3200,
    margin: 700,
    currency: 'EUR',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    owner_id: 'demo',
    client_id: '2',
    supplier_id: '2',
    title: 'Textiles été - Boutique Sénégal',
    description: 'Vêtements homme et femme',
    status: 'en_transit',
    total_cost: 1800,
    selling_price: 2400,
    margin: 600,
    currency: 'EUR',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    owner_id: 'demo',
    client_id: '3',
    title: 'Électroménager - Cameroun',
    description: 'Réfrigérateurs et climatiseurs',
    status: 'commande_passee',
    total_cost: 4200,
    selling_price: 5500,
    margin: 1300,
    currency: 'EUR',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    owner_id: 'demo',
    client_id: '4',
    title: 'Jouets enfants - Abidjan',
    description: 'Jouets éducatifs',
    status: 'livre',
    total_cost: 800,
    selling_price: 1200,
    margin: 400,
    currency: 'EUR',
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString(),
  },
]

const statusFilters = [
  { value: 'all', label: 'Tous' },
  { value: 'en_negociation', label: 'En négociation' },
  { value: 'commande_passee', label: 'Commande passée' },
  { value: 'en_production', label: 'En production' },
  { value: 'pret_expedition', label: 'Prêt pour expédition' },
  { value: 'en_transit', label: 'En transit' },
  { value: 'arrive', label: 'Arrivé' },
  { value: 'livre', label: 'Livré' },
  { value: 'annule', label: 'Annulé' },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projects] = useState<Project[]>(mockProjects)

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-tyr-navy">Projets</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez vos importations</p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-tyr-navy text-white rounded-lg hover:bg-tyr-navy/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau projet
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none appearance-none cursor-pointer"
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Aucun projet trouvé</p>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-tyr-navy text-white rounded-lg hover:bg-tyr-navy/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer un projet
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/projects/${project.id}`}
                className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-tyr-orange/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-tyr-navy truncate">{project.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${PROJECT_STATUS_COLORS[project.status]}`}>
                        {PROJECT_STATUS_LABELS[project.status]}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-sm text-gray-500 truncate mb-2">{project.description}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      Créé le {format(new Date(project.created_at), 'd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-sm text-gray-500">Marge</p>
                    <p className="font-bold text-green-600 text-lg">
                      {project.margin.toLocaleString('fr-FR')} {project.currency}
                    </p>
                    <div className="flex items-center gap-1 text-tyr-orange text-sm mt-1">
                      Voir détails <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}