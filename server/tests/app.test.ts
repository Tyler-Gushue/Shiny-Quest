import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('App-level handlers', () => {

  it('unknown route returns 404 JSON', async () => {

    const res = await request(app)
      .get('/api/does-not-exist')

    expect(res.status).toBe(404)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toEqual({ message: 'Not found' })

  })

  it('broken JSON body returns 400 with Invalid request', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email": "tyler@test.com", bad json')

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ message: 'Invalid request' })

  })

})
