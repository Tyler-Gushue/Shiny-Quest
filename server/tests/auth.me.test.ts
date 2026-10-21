import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { EMAIL, loginAndGetAccessToken, getResetToken } from './helpers.js'

describe('GET /api/auth/me', () => {

  it('valid access token returns 200 with user and no passwordHash', async () => {

    const accessToken = await loginAndGetAccessToken()

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe(EMAIL)
    expect(res.body.user.passwordHash).toBeUndefined()

  })

  it('no Authorization header returns 401', async () => {

    const res = await request(app)
      .get('/api/auth/me')

    expect(res.status).toBe(401)

  })

  it('garbage token returns 401', async () => {

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer notarealtoken`)

    expect(res.status).toBe(401)

  })

  it('reset token used as access token returns 401', async () => {

    const resetToken = await getResetToken()

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${resetToken}`)

    expect(res.status).toBe(401)

  })

})
