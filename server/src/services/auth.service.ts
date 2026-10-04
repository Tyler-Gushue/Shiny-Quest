import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { User } from '../models/User.js'
import { RefreshToken } from '../models/RefreshToken.js'
import { sendVerificationEmail, sendResetEmail } from './email.service.js'
import { createVerificationCode, verifyCode } from './verification.service.js'
import { VerificationCode } from '../models/VerificationCode.js'

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

interface NewVerificationCode {
  email: string
  userId: string
  purpose: 'email_verification' | 'password_reset'
}

interface VerifyCode {
  email: string,
  code: string
}

interface ResetPasswordInput {
  userId: string
  newPassword: string
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'
const RESET_TOKEN_EXPIRES_IN = process.env.RESET_TOKEN_EXPIRES_IN || '10m'
const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS) || 7

/**
 * function for generating access tokens so users can access protected routes
 * @param userId - user id connected to the access token
 * @returns the access token
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
 * function for generating reset tokens so users can reset password
 * @param userId - user id connected to the reset token
 * @returns the reset token
 */
export function generateResetToken(userId: string): string {

  if (!JWT_RESET_SECRET) throw new Error('JWT_RESET_SECRET is not set in .env')

  return jwt.sign(
    { sub: userId },
    JWT_RESET_SECRET,
    { expiresIn: RESET_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  )

}

/**
 * 
 * @param userId 
 * @returns 
 */
export async function createRefreshToken(userId: string): Promise<string> {

  const token = crypto.randomBytes(64).toString('hex')

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000)

  await RefreshToken.create({ tokenHash, userId, expiresAt })

  return token

}

/**
 * 
 * @param param0 
 */
export async function signup(input : SignupInput) {

  const email = input.email.trim().toLocaleLowerCase()
  const username = input.username.trim()
  const password = input.password.trim()

  if ( await User.findOne({ $or: [{ email }, { username }] }) ) {

    throw new Error('Email or username already taken')

  }

  const passwordHash = await bcrypt.hash(password, 12)


  const user = await User.create( { email, username, passwordHash})

  await sendVerificationCode({ email, userId: user._id.toString(), purpose: 'email_verification' })

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

  const email = input.email.trim().toLocaleLowerCase()
  const password = input.password.trim()
  

  const user = await User.findOne( { email } ).select( '+passwordHash' )

  if ( !user ) {

    throw new Error('Invalid email or password')

  }

  if ( !await bcrypt.compare( password, user.passwordHash ) ) {

    throw new Error('Invalid email or password')

  }

  if ( !user.emailVerified ) {

    await sendVerificationCode({ email, userId: user._id.toString(), purpose: 'email_verification' })
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

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const storedToken = await RefreshToken.findOne({ tokenHash })

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

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  await RefreshToken.deleteOne({ tokenHash })

}

export function verifyAccessToken( token: string ): string {

  if (!JWT_ACCESS_SECRET) throw new Error('JWT_ACCESS_SECRET is not set in .env')

  const payload = jwt.verify( token, JWT_ACCESS_SECRET )

  if ( typeof payload === 'string' || !payload.sub ) {

    throw new Error('Invalid access token')

  }

  return payload.sub

}

export function verifyResetToken( token: string ): { userId: string, iat: number } {

  if (!JWT_RESET_SECRET) throw new Error('JWT_RESET_SECRET is not set in .env')

  const payload = jwt.verify( token, JWT_RESET_SECRET )

  if ( typeof payload === 'string' || !payload.sub || !payload.iat ) {

    throw new Error('Invalid reset token')

  }

  return { userId: payload.sub, iat: payload.iat }

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
 * @param email 
 * @returns 
 */
export async function sendEmailVerificationCode (email: string) {

  const user = await User.findOne( { email } )

  if ( !user ) {

    return

  }

  if ( user.emailVerified ) {

    return

  }

  const userId = user._id.toString()

  const code = await createVerificationCode({ userId, purpose: 'email_verification' })

  try {

    await sendVerificationEmail(email, code)

  } catch (error) {

    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')

  }

  return

}

export async function sendResetVerificationCode (email: string) {

  const user = await User.findOne( { email } )

  if ( !user ) {

    return

  }

  const userId = user._id.toString()

  const code = await createVerificationCode({ userId, purpose: 'password_reset' })

  try {

    await sendResetEmail(email, code)

  } catch (error) {

    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')

  }

  return

}

/**
 * 
 * @param input 
 * @returns 
 */
async function sendVerificationCode (input: NewVerificationCode) {

  const { userId, purpose } = input
  const email = input.email.trim().toLocaleLowerCase()

  const code = await createVerificationCode({ userId, purpose })

  try {

    await sendVerificationEmail(email, code)

  } catch (error) {

    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')

  }

  return

}

/**
 * 
 * @param input 
 */
export async function verifyEmail (input: VerifyCode) {

  const code = input.code.trim()
  const email = input.email.trim().toLocaleLowerCase()

  const user = await User.findOne( { email } )

  if (!user) {

    throw new Error('Invalid or expired code')

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

/**
 * 
 * @param input 
 * @returns 
 */
export async function verifyReset (input: VerifyCode) {

  const code = input.code.trim()
  const email = input.email.trim().toLocaleLowerCase()

  const user = await User.findOne( { email } )

  if (!user) {

    throw new Error('Invalid or expired code')

  }

  const userId = user._id.toString()

  const purpose = 'password_reset'

  const isVerified = await verifyCode( {userId, purpose, code} )

  if ( isVerified ) {

    if ( !user.emailVerified ) {

      user.emailVerified = true
      await user.save()

    }

    const resetToken = generateResetToken(userId)

    return { resetToken }

  } else {

    throw new Error('Invalid or expired code')

  }

}

export async function resetPassword (input: ResetPasswordInput) {

  const { userId, newPassword} = input

  const user = await User.findById(userId)

  if ( !user ) {

    throw new Error('User not found')

  }

  await VerificationCode.deleteOne({ $and: [{ userId }, { purpose: 'password_reset' }] })

  const passwordHash = await bcrypt.hash(newPassword.trim(), 12)

  user.passwordHash = passwordHash
  user.passwordLastUpdated = new Date()
  await user.save()

  await RefreshToken.deleteMany({ userId })

  return

}