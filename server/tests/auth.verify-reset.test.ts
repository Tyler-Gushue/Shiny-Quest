import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { clearCodes, getLastCode, createUnverifiedUser, createVerifiedUser, EMAIL } from './helpers.js'
import { User } from '../src/models/User.js'

// A 6-digit code that is guaranteed not to match the real one
function wrongCode(code: string) {
  return code === '000000' ? '111111' : '000000'
}

async function requestResetCode() {

  clearCodes()

  await request(app)
    .post('/api/auth/reset-code')
    .send({ email: EMAIL })

  return getLastCode(EMAIL)!

}

describe('POST /api/auth/verify-reset', () => {

  it('correct code returns 200 with reset token', async () => {

    await createVerifiedUser()
    const code = await requestResetCode()

    const res = await request(app)
      .post('/api/auth/verify-reset')
      .send({ email: EMAIL, code })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Code Success')
    expect(typeof res.body.resetToken).toBe('string')

  })

  it('wrong code returns 400', async () => {

    await createVerifiedUser()
    const code = await requestResetCode()

    const res = await request(app)
      .post('/api/auth/verify-reset')
      .send({ email: EMAIL, code: wrongCode(code) })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid or expired code')
    expect(res.body.resetToken).toBeUndefined()

  })

  it('email verification code cannot be used for reset', async () => {

    await createUnverifiedUser()
    const emailCode = getLastCode(EMAIL)
    expect(emailCode).toBeDefined()

    const res = await request(app)
      .post('/api/auth/verify-reset')
      .send({ email: EMAIL, code: emailCode })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid or expired code')
    expect(res.body.resetToken).toBeUndefined()

  })

  it('unverified user who completes reset becomes verified', async () => {

    await createUnverifiedUser()

    const before = await User.findOne({ email: EMAIL })
    expect(before!.emailVerified).toBe(false)

    const code = await requestResetCode()

    const res = await request(app)
      .post('/api/auth/verify-reset')
      .send({ email: EMAIL, code })

    expect(res.status).toBe(200)

    const after = await User.findOne({ email: EMAIL })
    expect(after!.emailVerified).toBe(true)

  })

})
