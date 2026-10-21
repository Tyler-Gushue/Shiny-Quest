import request from 'supertest'
import app from '../src/app.js'
import { User } from '../src/models/User.js'

import { getLastCode } from './codes.js'

export { getLastCode, clearCodes } from './codes.js'

export const USERNAME = 'tyler'
export const EMAIL = 'tyler@test.com'
export const PASSWORD = 'Password1'

export async function createUnverifiedUser() {

  await request(app)
    .post('/api/auth/signup')
    .send({ username: USERNAME, email: EMAIL, password: PASSWORD, confirmPassword: PASSWORD })

}

export async function createVerifiedUser() {

  await createUnverifiedUser()

  await User.updateOne({ email: EMAIL }, { emailVerified: true })

}

export async function loginAndGetCookie() {

  await createVerifiedUser()

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: EMAIL, password: PASSWORD })

  return res.headers['set-cookie'] as unknown as string []

}

export async function loginAndGetAccessToken() {

  await createVerifiedUser()

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: EMAIL, password: PASSWORD })

  return res.body.accessToken as string

}

export async function getResetToken() {

  await createVerifiedUser()

  await request(app)
    .post('/api/auth/reset-code')
    .send({ email: EMAIL })

  const code = getLastCode(EMAIL)

  const res = await request(app)
    .post('/api/auth/verify-reset')
    .send({ email: EMAIL, code })

  return res.body.resetToken as string
}


