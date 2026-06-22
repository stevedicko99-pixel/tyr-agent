import { createError, handleApiError, validationError, notFoundError, unauthorizedError } from '@/lib/api/error-handler'

describe('Error Handler', () => {
  describe('createError', () => {
    it('should create an error object with timestamp', () => {
      const error = createError('Test error', 'TEST_CODE', 'Test details')
      
      expect(error.error).toBe('Test error')
      expect(error.code).toBe('TEST_CODE')
      expect(error.details).toBe('Test details')
      expect(error.timestamp).toBeDefined()
      expect(new Date(error.timestamp)).toBeInstanceOf(Date)
    })
  })

  describe('handleApiError', () => {
    it('should handle Error instances', () => {
      const testError = new Error('Test error message')
      const result = handleApiError(testError)
      
      expect(result.error).toBe('Test error message')
      expect(result.code).toBe('INTERNAL_ERROR')
    })

    it('should handle string errors', () => {
      const result = handleApiError('String error')
      
      expect(result.error).toBe('String error')
      expect(result.code).toBe('INTERNAL_ERROR')
    })

    it('should handle unknown error types', () => {
      const result = handleApiError({ foo: 'bar' })
      
      expect(result.error).toBe('Erreur inconnue')
      expect(result.code).toBe('UNKNOWN_ERROR')
      expect(result.details).toBe('{"foo":"bar"}')
    })
  })

  describe('validationError', () => {
    it('should create a validation error', () => {
      const result = validationError('email', 'Invalid email format')
      
      expect(result.error).toBe('Champ invalide: email')
      expect(result.code).toBe('VALIDATION_ERROR')
      expect(result.details).toBe('Invalid email format')
    })
  })

  describe('notFoundError', () => {
    it('should create a not found error', () => {
      const result = notFoundError('Client')
      
      expect(result.error).toBe('Client non trouvé')
      expect(result.code).toBe('NOT_FOUND')
    })
  })

  describe('unauthorizedError', () => {
    it('should create an unauthorized error', () => {
      const result = unauthorizedError()
      
      expect(result.error).toBe('Non autorisé')
      expect(result.code).toBe('UNAUTHORIZED')
    })
  })
})
