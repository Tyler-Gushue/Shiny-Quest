import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { getLastCode, createUnverifiedUser, USERNAME, EMAIL, PASSWORD } from './helpers.js'
import { User } from '../src/models/User.js'

describe('POST /api/auth/signup', () => {

  it('valid signup returns 201 and creates an unverified user', async () => {

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: USERNAME, email: EMAIL, password: PASSWORD, confirmPassword: PASSWORD })

    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Account created.  Check your email for verification code.')

    const user = await User.findOne({ email: EMAIL })
    expect(user).not.toBeNull()
    expect(user!.username).toBe(USERNAME)
    expect(user!.emailVerified).toBe(false)

  })

  it('sends a verification code', async () => {

    expect(getLastCode(EMAIL)).toBeUndefined()

    await request(app)
      .post('/api/auth/signup')
      .send({ username: USERNAME, email: EMAIL, password: PASSWORD, confirmPassword: PASSWORD })

    expect(getLastCode(EMAIL)).toMatch(/^\d{6}$/)

  })

  it('stores email in lowercase', async () => {

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: USERNAME, email: 'Tyler@TEST.com', password: PASSWORD, confirmPassword: PASSWORD })

    expect(res.status).toBe(201)

    const users = await User.find()
    expect(users).toHaveLength(1)
    expect(users[0].email).toBe('tyler@test.com')

  })

  it('duplicate email returns 409', async () => {

    await createUnverifiedUser()

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'someoneelse', email: EMAIL, password: PASSWORD, confirmPassword: PASSWORD })

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('Email or username already taken')
    expect(await User.countDocuments()).toBe(1)

  })

  it('duplicate username returns 409', async () => {

    await createUnverifiedUser()

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: USERNAME, email: 'other@test.com', password: PASSWORD, confirmPassword: PASSWORD })

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('Email or username already taken')
    expect(await User.countDocuments()).toBe(1)

  })

  it('missing fields returns 400', async () => {

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: EMAIL, password: PASSWORD, confirmPassword: PASSWORD })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('All fields are required')
    expect(await User.countDocuments()).toBe(0)

  })

  it('weak password returns 400', async () => {

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: USERNAME, email: EMAIL, password: 'password', confirmPassword: 'password' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Password must be 8 to 72 characters long, one lowercase letter, one uppercase letter, and at least one number')
    expect(await User.countDocuments()).toBe(0)

  })

  it('mismatched passwords returns 400', async () => {

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: USERNAME, email: EMAIL, password: PASSWORD, confirmPassword: 'Password2' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Password and confirm password do not match')
    expect(await User.countDocuments()).toBe(0)

  })

  it('invalid email format returns 400', async () => {

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: USERNAME, email: 'not-an-email', password: PASSWORD, confirmPassword: PASSWORD })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Email has invalid format')
    expect(await User.countDocuments()).toBe(0)

  })

})
