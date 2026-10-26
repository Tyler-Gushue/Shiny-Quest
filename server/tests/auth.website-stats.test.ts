import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { User } from '../src/models/User.js'
import { createVerifiedUser, PASSWORD } from './helpers.js'

describe('GET /api/auth/website-stats', () => {
  it('returns userCount matching number of users', async () => {

    const emptyRes = await request(app).get('/api/auth/website-stats')

    expect(emptyRes.status).toBe(200)
    expect(emptyRes.body.userCount).toBe(0)

    await createVerifiedUser()

    await request(app)
      .post('/api/auth/signup')
      .send({ username: 'ash', email: 'ash@test.com', password: PASSWORD, confirmPassword: PASSWORD })

    const res = await request(app).get('/api/auth/website-stats')

    expect(res.status).toBe(200)
    expect(res.body.userCount).toBe(2)
    expect(res.body.userCount).toBe(await User.countDocuments())

  })
})
