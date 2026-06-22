'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FolderKanban, 
  MessageSquare, 
  AddressBook, 
  Plus, 
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Eye,
  Copy,
  Check,
  ExternalLink,
  ShoppingCart,
  CheckCircle,
  XCircle,
  ArrowRightCircle
} from '@/components/icons'
import { Project, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, DashboardStats, ClientOrder, CLIENT_ORDER_STATUS_LABELS, CLIENT_ORDER_STATUS_COLORS } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [clientOrders, setClientOrders] = useState<ClientOrder[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch('/api/projects?ownerId=' + user.id)
        const statsData = await statsRes.json()
        const projects = statsData || []
        
        const activeProjects = projects.filter((p: Project) => p.status !== 'annule')
        const totalMargin = activeProjects.reduce((sum: number, p: Project) => sum + (p.margin || 0), 0)

        setStats({
          activeClients: 0, // Will be fetched separately
          activeProjects: activeProjects.length,
          totalMargin: Math.round(totalMargin),
          pendingMessages: 0,
        })

        // Fetch recent projects
        setRecentProjects(activeProjects.slice(0, 5))

        // Fetch client orders
        const ordersRes = await fetch('/api/orders?agentId=' + user.id)
        const ordersData = await ordersRes.json()
        if (ordersData.success) {
          setClientOrders(ordersData.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      }
    }

    fetchData()
  }, [user])

  const copyOrderLink = () => {
    if (!user) return
    const link = `${window.location.origin}/c/${user.id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConvertOrder = async (orderId: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, agent_id: user?.id, status: 'converted' }),
      })
      if (response.ok) {
        setClientOrders(clientOrders.filter(o => o.id !== orderId))
      }
    } catch (error) {
      console.error('Failed to convert order:', error)
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, agent_id: user?.id, status: 'rejected' }),
      })
      if (response.ok) {
        setClientOrders(clientOrders.filter(o => o.id !== orderId))
      }
    } catch (error) {
      console.error('Failed to reject order:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tyr-navy"></div>
      </div>
    )
  }

  const pendingOrders = clientOrders.filter(o => o.status === 'pending')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-tyr-navy">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Bienvenue, {user?.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Commandes clients</p>
              <p className="text-xl font-bold text-tyr-navy">{pendingOrders.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FolderKanban className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Projets en cours</p>
              <p className="text-xl font-bold text-tyr-navy">{stats?.activeProjects || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Marge totale</p>
              <p className="text-xl font-bold text-tyr-navy">
                {(stats?.totalMargin || 0).toLocaleString('fr-FR')} €
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Messages</p>
              <p className="text-xl font-bold text-tyr-navy">{stats?.pendingMessages || 0}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Order Link Section */}
      <div className="mb-8 bg-gradient-to-r from-tyr-navy to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Lien de commande public</h2>
            <p className="text-blue-100 text-sm">Partagez ce lien avec vos clients pour qu'ils soumettent directement leurs demandes.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 md:w-80 bg-white/10 rounded-lg px-4 py-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm truncate">{`${window.location.origin}/c/${user?.id}`}</span>
            </div>
            <button
              onClick={copyOrderLink}
              className="flex items-center gap-2 px-4 py-3 bg-white text-tyr-navy rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-tyr-navy mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/projects/new"
            className="flex items-center gap-3 p-4 bg-tyr-navy text-white rounded-xl hover:bg-tyr-navy/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nouveau projet</span>
          </Link>
          <Link
            href="/messages"
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-tyr-orange" />
            <span className="font-medium text-tyr-navy">Voir mes messages</span>
          </Link>
          <Link
            href="/address-book"
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <AddressBook className="w-5 h-5 text-tyr-orange" />
            <span className="font-medium text-tyr-navy">Carnet d&apos;adresses</span>
          </Link>
        </div>
      </div>

      {/* Client Orders */}
      {pendingOrders.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-tyr-navy">Commandes clients</h2>
          </div>
          <div className="space-y-3">
            {pendingOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="w-4 h-4 text-tyr-orange" />
                      <h3 className="font-medium text-tyr-navy truncate">{order.product_description}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span>Client: {order.client_name}</span>
                      <span>{order.client_contact}</span>
                      {order.budget && (
                        <span>Budget: {order.budget} €</span>
                      )}
                    </div>
                    {order.notes && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{order.notes}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CLIENT_ORDER_STATUS_COLORS[order.status]}`}>
                        {CLIENT_ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(order.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleConvertOrder(order.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Convertir
                    </button>
                    <button
                      onClick={() => handleRejectOrder(order.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Rejeter
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-tyr-navy">Projets récents</h2>
          <Link
            href="/projects"
            className="text-sm text-tyr-orange hover:text-tyr-orange/80 flex items-center gap-1"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucun projet pour le moment. Partagez votre lien de commande pour recevoir des demandes.</p>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-tyr-navy text-white rounded-lg hover:bg-tyr-navy/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Créer un nouveau projet
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-tyr-orange/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-tyr-navy truncate">{project.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${PROJECT_STATUS_COLORS[project.status]}`}>
                          {PROJECT_STATUS_LABELS[project.status]}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(project.created_at), 'd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-500">Marge</p>
                      <p className="font-bold text-green-600">
                        {project.margin?.toLocaleString('fr-FR')} {project.currency}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
