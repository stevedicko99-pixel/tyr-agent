'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Search,
  Building2
} from '@/components/icons'
import { Conversation, Supplier } from '@/types'
import { format, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'

// Données mockées
const mockConversations: Conversation[] = [
  {
    supplier_id: '1',
    supplier: {
      id: '1',
      owner_id: 'demo',
      name: 'Shenzhen Electronics Co.',
      contact_name: 'M. Wang',
      city: 'Shenzhen',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    last_message: 'Bonjour, la commande est prête pour expédition.',
    last_message_at: new Date().toISOString(),
    unread_count: 2,
  },
  {
    supplier_id: '2',
    supplier: {
      id: '2',
      owner_id: 'demo',
      name: 'Guangzhou Textiles Ltd',
      contact_name: 'Mme. Li',
      city: 'Guangzhou',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    last_message: 'Prix confirmé: 1800 EUR pour 100 unités.',
    last_message_at: new Date(Date.now() - 86400000).toISOString(),
    unread_count: 0,
  },
  {
    supplier_id: '3',
    supplier: {
      id: '3',
      owner_id: 'demo',
      name: 'Yiwu Market Trading',
      contact_name: 'M. Zhang',
      city: 'Yiwu',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    last_message: 'Quels sont les modèles disponibles ?',
    last_message_at: new Date(Date.now() - 172800000).toISOString(),
    unread_count: 1,
  },
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [conversations] = useState<Conversation[]>(mockConversations)

  const filteredConversations = conversations.filter(c =>
    c.supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.supplier.contact_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatMessageDate = (date: string) => {
    const d = new Date(date)
    if (isToday(d)) return format(d, 'HH:mm')
    if (isYesterday(d)) return 'Hier'
    return format(d, 'd MMM', { locale: fr })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-tyr-navy">Messagerie</h1>
        <p className="text-gray-500 text-sm mt-1">Conversations avec vos fournisseurs</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
        />
      </div>

      {/* Conversations */}
      {filteredConversations.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune conversation trouvée</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredConversations.map((conv, index) => (
            <motion.div
              key={conv.supplier_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/messages/${conv.supplier_id}`}
                className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-tyr-orange/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-tyr-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-tyr-navy" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-tyr-navy truncate">{conv.supplier.name}</h3>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatMessageDate(conv.last_message_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
                    {conv.supplier.contact_name && (
                      <p className="text-xs text-gray-400 mt-1">{conv.supplier.contact_name} • {conv.supplier.city}</p>
                    )}
                  </div>

                  {/* Unread badge */}
                  {conv.unread_count > 0 && (
                    <div className="w-6 h-6 bg-tyr-orange rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-medium">{conv.unread_count}</span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}