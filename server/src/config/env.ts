const REQUIRED_ENV_VARS = [
  'MONGODB_URI',
  'CLIENT_ORIGIN',
  'JWT_ACCESS_SECRET',
  'JWT_RESET_SECRET',
  'VERIFICATION_CODE_SECRET',
  'RESEND_API_KEY',
]

const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name])

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`)
  process.exit(1)
}
