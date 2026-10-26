import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { clearCodes, getLastCode, createVerifiedUser, EMAIL } from './helpers.js'

describe('POST /api/auth/reset-code', () => {
  it('existing user returns 200 and sends a code', async () => {

    await createVerifiedUser()
    clearCodes()

    const res = await request(app)
      .post('/api/auth/reset-code')
      .send({ email: EMAIL })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Email sent if account exists.')
    expect(getLastCode(EMAIL)).toBeDefined()

  })

  it('unknown email returns 200 with same message and sends no code', async () => {

    const res = await request(app)
      .post('/api/auth/reset-code')
      .send({ email: 'unknown@email.com' })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Email sent if account exists.')
    expect(getLastCode('unknown@email.com')).toBeUndefined()

  })
  
})
