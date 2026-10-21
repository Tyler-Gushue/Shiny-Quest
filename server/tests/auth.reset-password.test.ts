import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { getResetToken, loginAndGetAccessToken, EMAIL, PASSWORD } from './helpers.js'

const NEW_PASSWORD = 'NewPassword1'
const EXPIRED_MESSAGE = 'Your reset session has expired, please request a new code'

function resetPassword(token: string, newPassword = NEW_PASSWORD, confirmPassword = newPassword) {
  return request(app)
    .post('/api/auth/reset-password')
    .set('Authorization', `Bearer ${token}`)
    .send({ newPassword, confirmPassword })
}

describe('POST /api/auth/reset-password', () => {

  it('no token returns 401', async () => {

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ newPassword: NEW_PASSWORD, confirmPassword: NEW_PASSWORD })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe(EXPIRED_MESSAGE)

  })

  it('access token used as reset token returns 401', async () => {

    const accessToken = await loginAndGetAccessToken()
    expect(accessToken).toBeDefined()

    const res = await resetPassword(accessToken)

    expect(res.status).toBe(401)
    expect(res.body.message).toBe(EXPIRED_MESSAGE)

  })

  it('mismatched passwords returns 400', async () => {

    const token = await getResetToken()

    const res = await resetPassword(token, NEW_PASSWORD, 'NewPassword2')

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Password and confirm password must match')

  })

  it('weak password returns 400', async () => {

    const token = await getResetToken()

    const res = await resetPassword(token, 'weak')

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Password is invalid')

  })

  it('success returns 200', async () => {

    const token = await getResetToken()

    const res = await resetPassword(token)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Reset Password Success')

  })

  it('old password no longer works after reset', async () => {

    const token = await getResetToken()
    await resetPassword(token)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: PASSWORD })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid email or password')

  })

  it('new password works after reset', async () => {

    const token = await getResetToken()
    await resetPassword(token)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: NEW_PASSWORD })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeDefined()

  })

  it('old refresh cookies stop working after reset', async () => {

    const token = await getResetToken()

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: PASSWORD })

    expect(loginRes.status).toBe(200)
    const oldCookie = loginRes.headers['set-cookie'] as unknown as string[]

    const resetRes = await resetPassword(token)
    expect(resetRes.status).toBe(200)

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', oldCookie)

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Session expired, please log in again')

  })

  it('reusing the same reset token returns 401', async () => {

    const token = await getResetToken()

    const firstRes = await resetPassword(token)
    expect(firstRes.status).toBe(200)

    const res = await resetPassword(token, 'AnotherPassword1')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe(EXPIRED_MESSAGE)

  })

})
