export interface ApiError {
  error: string
  code?: string
  details?: string
  timestamp: string
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: ApiError
  success: boolean
}

export function createError(error: string, code?: string, details?: string): ApiError {
  return {
    error,
    code,
    details,
    timestamp: new Date().toISOString(),
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return createError(error.message, 'INTERNAL_ERROR', error.stack)
  }
  if (typeof error === 'string') {
    return createError(error, 'INTERNAL_ERROR')
  }
  return createError('Erreur inconnue', 'UNKNOWN_ERROR', JSON.stringify(error))
}

export function validationError(field: string, message: string): ApiError {
  return createError(`Champ invalide: ${field}`, 'VALIDATION_ERROR', message)
}

export function notFoundError(resource: string): ApiError {
  return createError(`${resource} non trouvé`, 'NOT_FOUND')
}

export function unauthorizedError(): ApiError {
  return createError('Non autorisé', 'UNAUTHORIZED')
}

export function forbiddenError(): ApiError {
  return createError('Accès interdit', 'FORBIDDEN')
}

export function rateLimitError(): ApiError {
  return createError('Trop de requêtes', 'RATE_LIMITED')
}

export function serviceUnavailableError(): ApiError {
  return createError('Service indisponible', 'SERVICE_UNAVAILABLE')
}
