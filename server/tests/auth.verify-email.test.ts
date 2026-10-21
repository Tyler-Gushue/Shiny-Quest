import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { clearCodes, getLastCode, createUnverifiedUser, EMAIL } from './helpers.js'
import { User } from '../src/models/User.js'

// A 6-digit code that is guaranteed not to match the real one
function wrongCode(code: string) {
  return code === '000000' ? '111111' : '000000'
}

async function isVerified() {
  const user = await User.findOne({ email: EMAIL })
  return user!.emailVerified
}

describe('POST /api/auth/verify-email', () => {

  it('correct code returns 200 with access token and refresh cookie and marks user verified', async () => {

    await createUnverifiedUser()
    const code = getLastCode(EMAIL)

    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: EMAIL, code })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Email Verified')
    expect(res.body.accessToken).toBeDefined()

    const cookie = String(res.header['set-cookie'])
    expect(cookie).toContain('refreshToken=')
    expect(cookie).toContain('HttpOnly')

    expect(await isVerified()).toBe(true)

  })

  it('wrong code returns 400', async () => {

    await createUnverifiedUser()
    const code = getLastCode(EMAIL)!

    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: EMAIL, code: wrongCode(code) })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid or expired code')
    expect(res.body.accessToken).toBeUndefined()
    expect(await isVerified()).toBe(false)

  })

  it('reusing a code returns 400', async () => {

    await createUnverifiedUser()
    const code = getLastCode(EMAIL)

    const firstRes = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: EMAIL, code })

    expect(firstRes.status).toBe(200)

    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: EMAIL, code })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid or expired code')

  })

  it('correct code after 5 wrong attempts returns 400', async () => {

    await createUnverifiedUser()
    const code = getLastCode(EMAIL)!

    for (let i = 0; i < 5; i++) {

      const wrongRes = await request(app)
        .post('/api/auth/verify-email')
        .send({ email: EMAIL, code: wrongCode(code) })

      expect(wrongRes.status).toBe(400)

    }

    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: EMAIL, code })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid or expired code')
    expect(await isVerified()).toBe(false)

  })

  it('unknown email returns 400 with same message as wrong code', async () => {

    await createUnverifiedUser()
    const code = getLastCode(EMAIL)!

    const wrongRes = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: EMAIL, code: wrongCode(code) })

    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: 'unknown@email.com', code })

    expect(res.status).toBe(400)
    expect(wrongRes.status).toBe(400)
    expect(res.body.message).toBe(wrongRes.body.message)

  })

  it('reset code cannot be used for email verification', async () => {

    await createUnverifiedUser()
    clearCodes()

    await request(app)
      .post('/api/auth/reset-code')
      .send({ email: EMAIL })

    const resetCode = getLastCode(EMAIL)
    expect(resetCode).toBeDefined()

    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: EMAIL, code: resetCode })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid or expired code')
    expect(await isVerified()).toBe(false)

  })

})
