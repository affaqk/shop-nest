export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'AE', name: 'United Arab Emirates' },
]

// Keep in sync with MAX_ADDRESSES in backend/models/userModel.js
export const MAX_ADDRESSES = 10

export const countryName = (code) => COUNTRIES.find((c) => c.code === code)?.name || code

// Blank address, with the name taken from the account
export const emptyAddress = (user) => {
  const [firstName = '', ...rest] = (user?.name || '').split(' ')
  return { label: 'Home', firstName, lastName: rest.join(' '), phone: '', address: '', city: '', state: '', zip: '', country: 'US' }
}
