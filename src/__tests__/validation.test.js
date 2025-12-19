import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  validateOTP,
  validateName,
  formatPhone,
  getValidationError
} from '../utils/validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('returns true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.in')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    it('returns false for invalid emails', () => {
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('invalid@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail(null)).toBe(false)
      expect(validateEmail(undefined)).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('returns true for valid Indian mobile numbers (10 digits starting with 6-9)', () => {
      expect(validatePhone('9876543210')).toBe(true)
      expect(validatePhone('8765432109')).toBe(true)
      expect(validatePhone('7654321098')).toBe(true)
      expect(validatePhone('6543210987')).toBe(true)
      expect(validatePhone('987-654-3210')).toBe(true)
      expect(validatePhone('(987) 654-3210')).toBe(true)
    })

    it('returns false for invalid Indian mobile numbers', () => {
      expect(validatePhone('')).toBe(false)
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('1234567890')).toBe(false) // starts with 1
      expect(validatePhone('5234567890')).toBe(false) // starts with 5
      expect(validatePhone('0234567890')).toBe(false) // starts with 0
      expect(validatePhone('98765432101')).toBe(false) // 11 digits
      expect(validatePhone('abcdefghij')).toBe(false)
      expect(validatePhone(null)).toBe(false)
      expect(validatePhone(undefined)).toBe(false)
    })
  })

  describe('validateOTP', () => {
    it('returns true for valid 4-digit OTPs', () => {
      expect(validateOTP('1234')).toBe(true)
      expect(validateOTP('0000')).toBe(true)
      expect(validateOTP('9999')).toBe(true)
    })

    it('returns false for invalid OTPs', () => {
      expect(validateOTP('')).toBe(false)
      expect(validateOTP('123')).toBe(false)
      expect(validateOTP('12345')).toBe(false)
      expect(validateOTP('abcd')).toBe(false)
      expect(validateOTP(null)).toBe(false)
      expect(validateOTP(undefined)).toBe(false)
    })
  })

  describe('validateName', () => {
    it('returns true for valid names', () => {
      expect(validateName('John')).toBe(true)
      expect(validateName('John Doe')).toBe(true)
      expect(validateName('Mary Jane Watson')).toBe(true)
    })

    it('returns false for invalid names', () => {
      expect(validateName('')).toBe(false)
      expect(validateName('J')).toBe(false)
      expect(validateName('John123')).toBe(false)
      expect(validateName('John@Doe')).toBe(false)
      expect(validateName(null)).toBe(false)
      expect(validateName(undefined)).toBe(false)
    })
  })

  describe('formatPhone', () => {
    it('formats phone numbers correctly', () => {
      expect(formatPhone('1234567890')).toBe('123-456-7890')
      expect(formatPhone('123')).toBe('123')
      expect(formatPhone('123456')).toBe('123-456')
    })

    it('handles empty input', () => {
      expect(formatPhone('')).toBe('')
      expect(formatPhone(null)).toBe('')
      expect(formatPhone(undefined)).toBe('')
    })
  })

  describe('getValidationError', () => {
    it('returns correct error for email', () => {
      expect(getValidationError('email', '')).toBe('Email is required')
      expect(getValidationError('email', 'invalid')).toBe('Please enter a valid email address')
      expect(getValidationError('email', 'valid@example.com')).toBe('')
    })

    it('returns correct error for phone', () => {
      expect(getValidationError('phone', '')).toBe('Phone number is required')
      expect(getValidationError('phone', '123')).toBe('Please enter a valid Indian mobile number (10 digits starting with 6-9)')
      expect(getValidationError('phone', '1234567890')).toBe('Please enter a valid Indian mobile number (10 digits starting with 6-9)')
      expect(getValidationError('phone', '9876543210')).toBe('')
    })

    it('returns correct error for otp', () => {
      expect(getValidationError('otp', '')).toBe('OTP is required')
      expect(getValidationError('otp', '12')).toBe('Please enter a valid 4-digit OTP')
      expect(getValidationError('otp', '1234')).toBe('')
    })

    it('returns correct error for name', () => {
      expect(getValidationError('name', '')).toBe('Name is required')
      expect(getValidationError('name', 'J')).toBe('Please enter a valid name (letters only, min 2 characters)')
      expect(getValidationError('name', 'John')).toBe('')
    })

    it('returns empty string for unknown field', () => {
      expect(getValidationError('unknown', 'value')).toBe('')
    })
  })
})

