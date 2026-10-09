// Mirrors the backend com.nt.security.PasswordPolicy so the user gets instant
// feedback. The server remains the source of truth and re-validates everything.
export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters long'
  if (password.length > 72) return 'Password must be at most 72 characters long'
  if (!/[A-Z]/.test(password)) return 'Password needs an uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password needs a lowercase letter'
  if (!/[0-9]/.test(password)) return 'Password needs a digit'
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password needs a special character'
  return null
}
