import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { createVerifiedUser, EMAIL, loginAndGetCookie, PASSWORD } from './helpers.js'

function tokenPart(cookie: string[]) {
  return cookie[0].split(';')[0]
}

describe('POST /api/auth/refresh', () => {

  it('valid cookie returns 200 with new access token and rotated cookie', async () => {

    const oldCookie = await loginAndGetCookie()

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', oldCookie)

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeDefined()

    const newCookie = res.headers['set-cookie'] as unknown as string[]
    expect(tokenPart(newCookie)).not.toBe(tokenPart(oldCookie))

  })

  it('reusing an old refresh cookie returns 401', async () => {

    const oldCookie = await loginAndGetCookie()

    await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', oldCookie)

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', oldCookie)

    expect(res.status).toBe(401)

  })

  it('no cookie returns 401', async () => {

    const res = await request(app)
      .post('/api/auth/refresh')
    
    expect(res.status).toBe(401)

  })

  it('garbage cookie returns 401', async () => {

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', 'refreshToken=notarealtoken')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Session expired, please log in again')

  })

  it('wrong Origin header returns 403', async () => {

    const cookie = await loginAndGetCookie()

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookie)
      .set('Origin', 'http://evil.com')

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Forbidden')

  })

  it('correct Origin header returns 200', async () => {

    const cookie = await loginAndGetCookie()

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:5173')

    expect(res.status).toBe(200)

  })

})
