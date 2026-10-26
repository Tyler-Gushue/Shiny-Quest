import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { clearCodes } from './codes.js'

vi.mock('../src/services/email.service.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/services/email.service.js')>()
  const { recordCode } = await import('./codes.js')

  return {
    ...actual,
    sendEmail: vi.fn(async () => ({ id: 'test-email' })),
    sendVerificationEmail: vi.fn(async (to: string, code: string) => {
      recordCode(to, code)
      return { id: 'test-email' }
    }),
    sendResetEmail: vi.fn(async (to: string, code: string) => {
      recordCode(to, code)
      return { id: 'test-email' }
    }),
  }
})

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterEach(async () => {
  const collections = await mongoose.connection.db!.collections()
  await Promise.all(collections.map((collection) => collection.deleteMany({})))
  clearCodes()
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer?.stop()
})
