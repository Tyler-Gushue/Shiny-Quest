import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { loginAndGetCookie } from './helpers.js'

describe('POST /api/auth/logout', () => {

  it('with cookie returns 200 and clears the cookie', async () => {

    const cookie = await loginAndGetCookie()

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookie)

    expect(res.status).toBe(200)

    const cleared = String(res.headers['set-cookie'])
    expect(cleared).toContain('refreshToken=;')
    expect(cleared).toContain('Expires=Thu, 01 Jan 1970')

  })

  it('refresh with old cookie after logout returns 401', async () => {

    const cookie = await loginAndGetCookie()

    await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookie)

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookie)

    expect(res.status).toBe(401)

  })

  it('no cookie still returns 200', async () => {

    const res = await request(app)
      .post('/api/auth/logout')

    expect(res.status).toBe(200)

  })

  it('wrong Origin header returns 403', async () => {

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Origin', 'http://evil.com')

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Forbidden')

  })
  
})
