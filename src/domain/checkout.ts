import type { CheckoutErrors, CheckoutInput } from './types'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function validateCheckout(input: CheckoutInput): CheckoutErrors {
  const errors: CheckoutErrors = {}

  if (input.name.trim().length < 2) errors.name = 'Enter your full name'
  if (!emailPattern.test(input.email.trim())) errors.email = 'Enter a valid email'
  if (input.address.trim().length === 0) errors.address = 'Enter your street address'
  if (input.city.trim().length === 0) errors.city = 'Enter your city'
  if (input.postalCode.trim().length < 3) errors.postalCode = 'Enter a postal code'
  if (digitsOnly(input.cardNumber).length !== 16) {
    errors.cardNumber = 'Enter a 16-digit card number'
  }
  if (!expiryPattern.test(input.expiry.trim())) errors.expiry = 'Use MM/YY'
  if (!/^\d{3}$/.test(input.cvc.trim())) errors.cvc = 'Enter a 3-digit CVC'

  return errors
}

export function emptyCheckout(): CheckoutInput {
  return {
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  }
}
