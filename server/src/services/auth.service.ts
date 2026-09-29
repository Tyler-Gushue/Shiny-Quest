import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { User } from '../models/User.js'
import { RefreshToken } from '../models/RefreshToken.js'
import { sendVerificationEmail } from './email.service.js'
import { createVerificationCode, verifyCode } from './verification.service.js'

// Types for what signup receives
interface SignupInput {
  username: string
  email: string
  password: string
}

interface LoginInput {
  email: string
  password: string
}

interface VerifyEmail {
  email: string,
  code: string
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

  const code = await createVerificationCode({ userId, purpose: 'email_verification' })

  try {

    await sendVerificationEmail(email, code)

  } catch (error) {

    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')

  }

  return {
    email: user.email
  }

}

/**
 * 
 * @param input 
 * @returns 
 */
export async function login( input : LoginInput ) {

  const { email, password } = input

  const user = await User.findOne( { email } ).select( '+passwordHash' )

  if ( !user ) {

    throw new Error('Invalid email or password')

  }

  if ( !await bcrypt.compare( password, user.passwordHash ) ) {

    throw new Error('Invalid email or password')

  }

    if ( !user.emailVerified ) {

    throw new Error('Email is not verified')

  }

  const userId = user._id.toString()

  const accessToken = generateAccessToken(userId)
  const refreshToken = await createRefreshToken(userId)

  return {

    user: { id: userId, username: user.username, email: user.email },
    accessToken,
    refreshToken

  }

}

/**
 * 
 * @param token 
 * @returns 
 */
export async function  refresh( token: string ) {

  const storedToken = await RefreshToken.findOne( { token } )

  if ( !storedToken || storedToken.expiresAt < new Date() ) {

    throw new Error("Invalid refresh token")

  }

  const user = await User.findById( storedToken.userId )

  if ( !user ) {

    throw new Error("Invalid refresh token")

  }

  const accessToken = generateAccessToken( user._id.toString() )

  return {

     user: { id: user._id.toString(), username: user.username, email: user.email },
     accessToken

  }
  
}

/**
 * 
 * @param token 
 */
export async function logout( token: string ) {

  await RefreshToken.deleteOne( { token } )

}

export function verifyAccessToken( token: string ): string {

  if (!JWT_ACCESS_SECRET) throw new Error('JWT_ACCESS_SECRET is not set in .env')

  const payload = jwt.verify( token, JWT_ACCESS_SECRET )

  if ( typeof payload === 'string' || !payload.sub ) {

    throw new Error('Invalid access token')

  }

  return payload.sub

}

/**
 * 
 * @param userId 
 * @returns 
 */
export async function getCurrentUser(userId: string) {

  const user = await User.findById(userId)

  if (!user) {

    throw new Error('User not found')

  }

  return ({ id: user._id.toString(), username: user.username, email: user.email })

}

/**
 * 
 * @param input 
 */
export async function verifyEmail (input: VerifyEmail) {

  const { email, code } = input

  const user = await User.findOne( { email } )

  if (!user) {

    throw new Error('Invalid or expired code')

  }

  if ( user.emailVerified ) {

    throw new Error ( 'Email already verified' )

  }

  const userId = user._id.toString()

  const purpose = 'email_verification'

  const isVerified = await verifyCode( {userId, purpose, code} )

  if ( isVerified ) {

    user.emailVerified = true
    await user.save()

    const accessToken = generateAccessToken(userId)
    const refreshToken = await createRefreshToken(userId)

    return {

      user: { id: userId, username: user.username, email: user.email },
      accessToken,
      refreshToken

    }


  } else {

    throw new Error('Invalid or expired code')

  }

}