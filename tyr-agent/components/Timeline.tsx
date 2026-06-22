'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  Package, 
  Factory, 
  Truck, 
  Ship, 
  CheckCircle, 
  MapPin,
  Plus,
  X,
  Upload,
  Calendar
} from '@/components/icons'
import { TrackingEvent } from '@/types'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'

interface TimelineProps {
  events: TrackingEvent[]
  onAddEvent?: (event: Omit<TrackingEvent, 'id' | 'created_at'>) => void
}

const eventIcons: Record<string, React.ElementType> = {
  commande: Factory,
  production: Factory,
  expedition: Package,
  transit: Truck,
  arrive: Ship,
  livre: CheckCircle,
  douane: MapPin,
  default: MapPin,
}

const eventColors: Record<string, string> = {
  commande: 'bg-blue-500',
  production: 'bg-purple-500',
  expedition: 'bg-orange-500',
  transit: 'bg-cyan-500',
  arrive: 'bg-teal-500',
  livre: 'bg-green-500',
  douane: 'bg-yellow-500',
  default: 'bg-gray-500',
}

export function Timeline({ events, onAddEvent }: TimelineProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0]
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast.error('Veuillez entrer un titre')
      return
    }

    if (onAddEvent) {
      onAddEvent({
        project_id: events[0]?.project_id || '',
        owner_id: events[0]?.owner_id || '',
        title: newEvent.title,
        description: newEvent.description || null,
        event_date: newEvent.event_date,
        photo_url: null
      })
      toast.success('Événement ajouté')
      setShowAddForm(false)
      setNewEvent({ title: '', description: '', event_date: new Date().toISOString().split('T')[0] })
    }
  }

  const getEventIcon = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('commande')) return Factory
    if (lowerTitle.includes('production') || lowerTitle.includes('fabricat')) return Factory
    if (lowerTitle.includes('expédit') || lowerTitle.includes('embal')) return Package
    if (lowerTitle.includes('transit') || lowerTitle.includes('camion')) return Truck
    if (lowerTitle.includes('arriv') || lowerTitle.includes('port')) return Ship
    if (lowerTitle.includes('livr') || lowerTitle.includes('recev')) return CheckCircle
    if (lowerTitle.includes('douane')) return MapPin
    return MapPin
  }

  const getEventColor = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('commande')) return 'bg-blue-500'
    if (lowerTitle.includes('production') || lowerTitle.includes('fabricat')) return 'bg-purple-500'
    if (lowerTitle.includes('expédit') || lowerTitle.includes('embal')) return 'bg-orange-500'
    if (lowerTitle.includes('transit') || lowerTitle.includes('camion')) return 'bg-cyan-500'
    if (lowerTitle.includes('arriv') || lowerTitle.includes('port')) return 'bg-teal-500'
    if (lowerTitle.includes('livr') || lowerTitle.includes('recev')) return 'bg-green-500'
    if (lowerTitle.includes('douane')) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  // Sort events by date (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  )

  return (
    <div className="space-y-4">
      {/* Add event button */}
      <div className="flex justify-end mb-4">
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-tyr-navy text-white rounded-lg hover:bg-tyr-navy/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une étape
          </button>
        )}
      </div>

      {/* Add event form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-tyr-navy">Nouvelle étape</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Ex: Commande confirmée"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newEvent.event_date}
                onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Détails de l'étape..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Ajouter une photo
              </button>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddEvent}
                className="flex-1 px-4 py-2 bg-tyr-navy text-white rounded-lg hover:bg-tyr-navy/90 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="relative">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Aucune étape de suivi</p>
            <p className="text-sm">Ajoutez la première étape de suivi</p>
          </div>
        ) : (
          <div className="space-y-0">
            {sortedEvents.map((event, index) => {
              const Icon = getEventIcon(event.title)
              const color = getEventColor(event.title)
              const isLast = index === sortedEvents.length - 1

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center z-10`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {!isLast && (
                      <div className="w-0.5 h-20 bg-gray-200" />
                    )}
                  </div>

                  {/* Event content */}
                  <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-tyr-orange/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-tyr-navy">{event.title}</h4>
                        <span className="text-xs text-gray-400">
                          {format(new Date(event.event_date), 'd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      )}
                      {event.photo_url && (
                        <img
                          src={event.photo_url}
                          alt="Photo de l'événement"
                          className="rounded-lg max-h-40 object-cover"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}