import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { User } from '../models/User.js'
import { RefreshToken } from '../models/RefreshToken.js'

// Types for what signup receives
interface SignupInput {
  username: string
  email: string
  password: string
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'

const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS) || 7

/**
 * 
 * @param userId 
 * @returns 
 */
export function generateAccessToken(userId: string): string {

  if (!JWT_ACCESS_SECRET) throw new Error('JWT_ACCESS_SECRET is not set in .env')

  return jwt.sign(
    { sub: userId },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  )

}

/**
 * 
 * @param userId 
 * @returns 
 */
export async function createRefreshToken(userId: string): Promise<string> {

  const token = crypto.randomBytes(64).toString('hex')

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000)

  await RefreshToken.create({ token, userId, expiresAt })

  return token

}

/**
 * 
 * @param param0 
 */
export async function signup(input : SignupInput) {

  const { username, email, password } = input

  if ( await User.findOne({ $or: [{ email }, { username }] }) ) {

    throw new Error('Email or username already taken')

  }

  const passwordHash = await bcrypt.hash(password, 12)


  const user = await User.create( { email, username, passwordHash})

  const userId = user._id.toString()

  const accessToken = generateAccessToken(userId)
  const refreshToken = await createRefreshToken(userId)

  return {
    user: { id: userId, username: user.username, email: user.email },
    accessToken,
    refreshToken,
  }

}