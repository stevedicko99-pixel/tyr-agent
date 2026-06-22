'use client'

import { useState, useEffect } from 'react'
import { createServerClient } from '@/lib/supabase/server-client'
import { Package, Upload, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ClientOrderFormData {
  productDescription: string
  notes: string
  budget: string
  clientName: string
  clientContact: string
  paymentProof: File | null
}

export default function ClientOrderPage({ params }: { params: { agentId: string } }) {
  const [agent, setAgent] = useState<{ id: string; full_name: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [agentNotFound, setAgentNotFound] = useState(false)
  const [formData, setFormData] = useState<ClientOrderFormData>({
    productDescription: '',
    notes: '',
    budget: '',
    clientName: '',
    clientContact: '',
    paymentProof: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgent = async () => {
      const supabase = createServerClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', params.agentId)
        .single()
      
      if (error || !data) {
        setAgentNotFound(true)
      } else {
        setAgent(data)
      }
      setLoading(false)
    }

    fetchAgent()
  }, [params.agentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (!formData.productDescription.trim()) {
      setError('Veuillez décrire le produit souhaité')
      setSubmitting(false)
      return
    }

    if (!formData.clientName.trim()) {
      setError('Veuillez indiquer votre nom')
      setSubmitting(false)
      return
    }

    if (!formData.clientContact.trim()) {
      setError('Veuillez indiquer votre contact (email ou téléphone)')
      setSubmitting(false)
      return
    }

    if (!formData.paymentProof) {
      setError('Veuillez télécharger une preuve de paiement')
      setSubmitting(false)
      return
    }

    const formDataBody = new FormData()
    formDataBody.append('agentId', params.agentId)
    formDataBody.append('productDescription', formData.productDescription)
    formDataBody.append('notes', formData.notes)
    formDataBody.append('budget', formData.budget)
    formDataBody.append('clientName', formData.clientName)
    formDataBody.append('clientContact', formData.clientContact)
    formDataBody.append('paymentProof', formData.paymentProof)

    try {
      const response = await fetch('/api/orders/submit', {
        method: 'POST',
        body: formDataBody,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.error || 'Échec de la soumission')
      }

      setSubmitSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (agentNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Lien invalide</h1>
          <p className="text-gray-600">
            Le lien de commande que vous utilisez n'est pas valide ou n'existe plus.
          </p>
        </div>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Commande soumise !</h1>
          <p className="text-gray-600 mb-6">
            Merci pour votre demande. {agent?.full_name || 'L\'agent'} va traiter votre commande et vous contacter dans les plus brefs délais.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Soumettre une nouvelle commande
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Commande Tyr Agent</h1>
              <p className="text-sm text-gray-500">Demande de sourcing</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">
                {agent?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Agent responsable</p>
              <p className="font-semibold text-gray-800">{agent?.full_name || 'Agent Tyr'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Produit souhaité <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.productDescription}
                onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                placeholder="Décrivez le produit que vous cherchez (ex: T-shirts en coton, chaussures de sport, électronique...)"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description / Quantité / Budget (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Précisez la quantité souhaitée, votre budget approximatif, ou toute autre information utile..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget estimé (optionnel)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="1000"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Indiquez votre budget en EUR</p>
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Client Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.clientContact}
                onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
                placeholder="email@exemple.com ou +226 65 00 00 00"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Payment Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preuve de paiement <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  formData.paymentProof
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
                onClick={() => document.getElementById('paymentProofInput')?.click()}
              >
                <Upload className={`w-10 h-10 mx-auto mb-3 ${formData.paymentProof ? 'text-green-500' : 'text-gray-400'}`} />
                {formData.paymentProof ? (
                  <div>
                    <p className="text-green-600 font-medium">{formData.paymentProof.name}</p>
                    <p className="text-sm text-gray-500">{(formData.paymentProof.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600">Cliquez pour télécharger</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF ou PDF (max 5 Mo)</p>
                  </div>
                )}
                <input
                  id="paymentProofInput"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({ ...formData, paymentProof: e.target.files[0] })
                    }
                  }}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-600">{error}</span>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Soumettre la commande
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>En soumettant votre commande, vous acceptez nos conditions d'utilisation.</p>
        </div>
      </main>
    </div>
  )
}
