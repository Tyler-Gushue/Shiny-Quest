import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { getLastCode, createUnverifiedUser, createVerifiedUser, EMAIL, PASSWORD } from './helpers.js'

describe('POST /api/auth/login', () => {

  it('verified user with correct password returns 200 with access token and httpOnly refresh cookie', async ()  => {

    await createVerifiedUser()

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: PASSWORD })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeDefined()

    const cookie = String(res.header['set-cookie'])
    expect(cookie).toContain('refreshToken=')
    expect(cookie).toContain('HttpOnly')

  })

  it('wrong password returns 401', async () => {

    await createVerifiedUser()

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: 'WrongPass1' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid email or password')

  })

  it('unknown email returns 401 with same message as wrong password', async () => {

    await createVerifiedUser()

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@email.com', password: PASSWORD })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid email or password')

  })

  it('unverified user returns 403 and sends a new code', async () => {

    await createUnverifiedUser()

    const firstCode = getLastCode(EMAIL)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: PASSWORD })

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Email is not verified')

    expect(res.body.accessToken).toBeUndefined()

    expect(getLastCode(EMAIL)).not.toBe(firstCode)

  })

  it('response never includes passwordHash', async () => {

    await createVerifiedUser()

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: PASSWORD })

    expect(res.status).toBe(200)
    expect(res.body.user.passwordHash).toBeUndefined()

  })

})
