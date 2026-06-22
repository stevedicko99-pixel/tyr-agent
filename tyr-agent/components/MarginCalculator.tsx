'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  Percent,
  Package,
  Truck,
  Shield
} from '@/components/icons'
import { PRODUCT_CATEGORIES } from '@/types'

interface MarginCalculatorProps {
  initialValues?: {
    purchasePrice?: number
    quantity?: number
    shippingCost?: number
    sellingPrice?: number
    currency?: string
    category?: string
  }
  onSave?: (values: MarginValues) => void
}

interface MarginValues {
  purchasePrice: number
  quantity: number
  shippingCost: number
  customsDuty: number
  sellingPrice: number
  currency: string
  totalCost: number
  margin: number
  marginRate: number
}

export function MarginCalculator({ initialValues, onSave }: MarginCalculatorProps) {
  const [values, setValues] = useState({
    purchasePrice: initialValues?.purchasePrice || 0,
    quantity: initialValues?.quantity || 1,
    shippingCost: initialValues?.shippingCost || 0,
    sellingPrice: initialValues?.sellingPrice || 0,
    currency: initialValues?.currency || 'EUR',
    category: initialValues?.category || 'other'
  })

  const [dutyRate, setDutyRate] = useState(0.15)

  useEffect(() => {
    const cat = PRODUCT_CATEGORIES.find(c => c.value === values.category)
    if (cat) setDutyRate(cat.duty_rate)
  }, [values.category])

  const calculations: MarginValues = {
    purchasePrice: values.purchasePrice,
    quantity: values.quantity,
    shippingCost: values.shippingCost,
    customsDuty: values.purchasePrice * values.quantity * dutyRate,
    sellingPrice: values.sellingPrice,
    currency: values.currency,
    totalCost: values.purchasePrice * values.quantity + values.shippingCost + (values.purchasePrice * values.quantity * dutyRate),
    margin: values.sellingPrice - (values.purchasePrice * values.quantity + values.shippingCost + (values.purchasePrice * values.quantity * dutyRate)),
    marginRate: values.sellingPrice > 0 
      ? ((values.sellingPrice - (values.purchasePrice * values.quantity + values.shippingCost + (values.purchasePrice * values.quantity * dutyRate))) / values.sellingPrice) * 100
      : 0
  }

  const getMarginColor = () => {
    if (calculations.marginRate >= 20) return 'text-green-600 bg-green-100'
    if (calculations.marginRate >= 10) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getMarginIcon = () => {
    if (calculations.marginRate >= 20) return TrendingUp
    if (calculations.marginRate >= 10) return Minus
    return TrendingDown
  }

  const handleInputChange = (field: string, value: string | number) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(calculations)
    }
  }

  const MarginIcon = getMarginIcon()

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-tyr-navy" />
          <h3 className="font-semibold text-tyr-navy">Calculateur de marge</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Purchase Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix d&apos;achat unitaire (FOB)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={values.purchasePrice || ''}
                onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={values.quantity || ''}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                min="1"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Shipping Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coût du fret estimé
            </label>
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={values.shippingCost || ''}
                onChange={(e) => handleInputChange('shippingCost', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Category / Customs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie (droits de douane)
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={values.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none appearance-none bg-white"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} ({(cat.duty_rate * 100).toFixed(0)}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selling Price */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix de vente au client
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={values.sellingPrice || ''}
                onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyr-orange focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-tyr-navy" />
          <h3 className="font-semibold text-tyr-navy">Résultats</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Coût d&apos;achat</p>
            <p className="font-semibold text-tyr-navy">
              {(values.purchasePrice * values.quantity).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {values.currency}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Fret</p>
            <p className="font-semibold text-tyr-navy">
              {values.shippingCost.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {values.currency}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Droits de douane ({(dutyRate * 100).toFixed(0)}%)</p>
            <p className="font-semibold text-tyr-navy">
              {calculations.customsDuty.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {values.currency}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Coût total rendu</p>
            <p className="font-bold text-tyr-navy">
              {calculations.totalCost.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {values.currency}
            </p>
          </div>
        </div>

        {/* Margin Result */}
        <div className={`rounded-xl p-6 ${getMarginColor()}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80 mb-1">Marge brute</p>
              <p className="text-3xl font-bold">
                {calculations.margin.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {values.currency}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80 mb-1">Taux de marge</p>
              <div className="flex items-center gap-2 justify-end">
                <MarginIcon className="w-6 h-6" />
                <p className="text-3xl font-bold">
                  {calculations.marginRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {onSave && (
          <button
            onClick={handleSave}
            className="w-full mt-4 px-4 py-3 bg-tyr-navy text-white rounded-lg hover:bg-tyr-navy/90 transition-colors font-medium"
          >
            Enregistrer les valeurs
          </button>
        )}
      </div>
    </div>
  )
}