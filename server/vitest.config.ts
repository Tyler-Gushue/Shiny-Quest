import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    hookTimeout: 60000,
    env: {
      NODE_ENV: 'test',
      PORT: '5001',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/shiny-quest-test',
      CLIENT_ORIGIN: 'http://localhost:5173',
      JWT_ACCESS_SECRET: 'test-access-secret',
      JWT_RESET_SECRET: 'test-reset-secret',
      ACCESS_TOKEN_EXPIRES_IN: '15m',
      RESET_TOKEN_EXPIRES_IN: '10m',
      REFRESH_TOKEN_DAYS: '7',
      VERIFICATION_CODE_SECRET: 'test-verification-secret',
      VERIFICATION_CODE_EXPIRES_IN: '10',
      RESEND_API_KEY: 're_test_key',
      EMAIL_FROM: 'Shiny Quest <no-reply@test.local>',
    },
  },
})
