'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Send, 
  Languages,
  Building2,
  Phone,
  MoreVertical,
  Loader2
} from '@/components/icons'
import { Message, Supplier } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'

// Données mockées
const mockSupplier: Supplier = {
  id: '1',
  owner_id: 'demo',
  name: 'Shenzhen Electronics Co.',
  contact_name: 'M. Wang',
  email: 'wang@sz-electronics.com',
  phone: '+86 138 1234 5678',
  wechat: 'wang_electronics',
  alibaba_url: null,
  address: null,
  city: 'Shenzhen',
  country: 'Chine',
  notes: null,
  rating: 4.5,
  source: 'agent',
  is_verified: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockMessages: Message[] = [
  {
    id: '1',
    owner_id: 'demo',
    supplier_id: '1',
    sender_id: null,
    recipient_id: '1',
    body_fr: 'Bonjour M. Wang, je suis intéressé par vos smartphones.',
    body_zh: '你好王先生，我想了解你们的智能手机。',
    direction: 'sent',
    read: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    owner_id: 'demo',
    supplier_id: '1',
    sender_id: '1',
    recipient_id: null,
    body_fr: 'Bonjour ! Merci pour votre intérêt. Nous avons les derniers modèles.',
    body_zh: '你好！感谢您的关注。我们有最新型号。',
    direction: 'received',
    read: true,
    created_at: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: '3',
    owner_id: 'demo',
    supplier_id: '1',
    sender_id: null,
    recipient_id: '1',
    body_fr: 'Quel est le prix pour 50 unités ?',
    body_zh: '50台的价格是多少？',
    direction: 'sent',
    read: true,
    created_at: new Date(Date.now() - 3400000).toISOString(),
  },
  {
    id: '4',
    owner_id: 'demo',
    supplier_id: '1',
    sender_id: '1',
    recipient_id: null,
    body_fr: '总共2500欧元，包括运费。',
    body_zh: '总共2500欧元，包括运费。',
    direction: 'received',
    read: false,
    created_at: new Date().toISOString(),
  },
]

export default function MessageDetailPage() {
  const params = useParams()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [supplier] = useState<Supplier>(mockSupplier)
  const [draftMessage, setDraftMessage] = useState('')
  const [translatedMessage, setTranslatedMessage] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [showTranslate, setShowTranslate] = useState(true)
  const [translatingMessageId, setTranslatingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const translateText = async (text: string, targetLang: 'zh' | 'fr') => {
    try {
      const response = await fetch('/api/messages/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang, sourceLang: targetLang === 'zh' ? 'fr' : 'zh' })
      })
      const data = await response.json()
      return data.translation || text
    } catch (error) {
      console.error('Translation error:', error)
      return text
    }
  }

  const handleTranslate = async () => {
    if (!draftMessage.trim()) return
    
    setIsTranslating(true)
    try {
      const translation = await translateText(draftMessage, 'zh')
      setTranslatedMessage(translation)
      toast.success('Traduction prête')
    } catch (error) {
      toast.error('Erreur de traduction')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSend = async (useTranslation: boolean = false) => {
    const textToSend = useTranslation && translatedMessage ? translatedMessage : draftMessage
    
    if (!textToSend.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      owner_id: 'demo',
      supplier_id: params.supplierId as string,
      sender_id: null,
      recipient_id: '1',
      body_fr: draftMessage,
      body_zh: useTranslation && translatedMessage ? translatedMessage : null,
      direction: 'sent',
      read: true,
      created_at: new Date().toISOString(),
    }

    setMessages([...messages, message])
    setDraftMessage('')
    setTranslatedMessage('')
    toast.success('Message envoyé')
  }

  const handleTranslateReceived = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || !message.body_zh) return

    setTranslatingMessageId(messageId)
    try {
      const translation = await translateText(message.body_zh, 'fr')
      toast.success(translation)
    } catch (error) {
      toast.error('Erreur de traduction')
    } finally {
      setTranslatingMessageId(null)
    }
  }

  const formatMessageTime = (date: string) => {
    return format(new Date(date), 'HH:mm', { locale: fr })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/messages"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-tyr-navy/10 rounded-full flex items-center justify-center">
            <Building2 className="w-5 h-5 text-tyr-navy" />
          </div>
          <div>
            <h1 className="font-semibold text-tyr-navy">{supplier.name}</h1>
            <p className="text-sm text-gray-500">{supplier.contact_name} • {supplier.city}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {supplier.phone && (
            <a
              href={`tel:${supplier.phone}`}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
          )}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Translate toggle */}
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={() => setShowTranslate(!showTranslate)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            showTranslate
              ? 'bg-tyr-orange/10 text-tyr-orange'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Languages className="w-4 h-4" />
          Traduction {showTranslate ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl border border-gray-200 min-h-[400px] max-h-[500px] overflow-y-auto p-4 mb-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${msg.direction === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.direction === 'sent'
                    ? 'bg-tyr-navy text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {/* Message content - show ZH for sent, FR for received (or both if translated) */}
                {msg.direction === 'sent' ? (
                  <>
                    {msg.body_fr && (
                      <p className="text-sm mb-1 opacity-80">{msg.body_fr}</p>
                    )}
                    {msg.body_zh && (
                      <p className="text-sm">{msg.body_zh}</p>
                    )}
                  </>
                ) : (
                  <>
                    {msg.body_zh && (
                      <div className="mb-1">
                        <p className="text-sm opacity-80">{msg.body_zh}</p>
                        <button
                          onClick={() => handleTranslateReceived(msg.id)}
                          disabled={translatingMessageId === msg.id}
                          className="text-xs mt-1 opacity-60 hover:opacity-100 flex items-center gap-1"
                        >
                          {translatingMessageId === msg.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Languages className="w-3 h-3" />
                          )}
                          Traduire en français
                        </button>
                      </div>
                    )}
                    {msg.body_fr && (
                      <p className="text-sm">{msg.body_fr}</p>
                    )}
                  </>
                )}
                
                {/* Time */}
                <p
                  className={`text-xs mt-1 ${
                    msg.direction === 'sent' ? 'text-white/60' : 'text-gray-400'
                  }`}
                >
                  {formatMessageTime(msg.created_at)}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Translation preview */}
      {translatedMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-tyr-orange/10 border border-tyr-orange/30 rounded-xl p-3 mb-4"
        >
          <p className="text-xs text-tyr-orange font-medium mb-1">Traduction chinoise :</p>
          <p className="text-sm text-gray-800">{translatedMessage}</p>
          <button
            onClick={() => setTranslatedMessage('')}
            className="text-xs text-gray-500 mt-1 hover:text-gray-700"
          >
            Effacer
          </button>
        </motion.div>
      )}

      {/* Input */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            placeholder="Écrire un message en français..."
            className="flex-1 px-4 py-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(false)
              }
            }}
          />
          <button
            onClick={handleTranslate}
            disabled={!draftMessage.trim() || isTranslating}
            className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            title="Traduire en chinois"
          >
            {isTranslating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Languages className="w-5 h-5" />
            )}
          </button>
          {translatedMessage ? (
            <button
              onClick={() => handleSend(true)}
              className="p-3 bg-tyr-orange text-white rounded-lg hover:bg-tyr-orange/90 transition-colors"
              title="Envoyer la traduction"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => handleSend(false)}
              disabled={!draftMessage.trim()}
              className="p-3 bg-tyr-navy text-white rounded-lg hover:bg-tyr-navy/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Écrivez en français, cliquez sur l&apos;icône traduction pour convertir en chinois avant d&apos;envoyer.
        </p>
      </div>
    </div>
  )
}