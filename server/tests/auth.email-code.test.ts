import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { clearCodes, getLastCode, createUnverifiedUser, createVerifiedUser, EMAIL } from './helpers.js'

describe('POST /api/auth/email-code', () => {

  it('unverified user returns 200 and sends a new code', async () => {

    await createUnverifiedUser()
    const firstCode = getLastCode(EMAIL)

    const res = await request(app)
      .post('/api/auth/email-code')
      .send({ email: EMAIL })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Email sent if account exists.')
    expect(getLastCode(EMAIL)).not.toBe(firstCode)

  })
  
  it('old code stops working after a new one is sent', async () => {

    await createUnverifiedUser()
    const oldCode = getLastCode(EMAIL)

    await request(app)
      .post('/api/auth/email-code')
      .send({ email: EMAIL })

    const newCode = getLastCode(EMAIL)

    const oldRes = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: EMAIL, code: oldCode })

    expect(oldRes.status).toBe(400)
    expect(oldRes.body.message).toBe('Invalid or expired code')

    const newRes = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: EMAIL, code: newCode })

    expect(newRes.status).toBe(200)      

  })

  it('unknown email returns 200 with same message and sends no code', async () => {

    const res = await request(app)
      .post('/api/auth/email-code')
      .send({ email: 'uknown@email.com' })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Email sent if account exists.')
    expect(getLastCode('uknown@email.com')).toBeUndefined()

  })

  it('already verified user returns 200 and sends no code', async () => {

    await createVerifiedUser();
    clearCodes()

    const res = await request(app)
      .post('/api/auth/email-code')
      .send({ email: EMAIL })

    expect(res.status).toBe(200)
    expect(getLastCode(EMAIL)).toBeUndefined()

  })

})
