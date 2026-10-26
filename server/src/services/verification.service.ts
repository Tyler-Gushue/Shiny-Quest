import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { VerificationCode } from '../models/VerificationCode.js'

interface CodeInput {
    userId: string
    purpose: 'email_verification' | 'password_reset'
}

interface VerifyCodeInput extends CodeInput {
    code: string
}

const MAX_CODE_ATTEMPTS = 5
const VERIFICATION_CODE_SECRET = process.env.VERIFICATION_CODE_SECRET
const VERIFICATION_CODE_EXPIRES_IN = (Number(process.env.VERIFICATION_CODE_EXPIRES_IN) || 10) * 60 * 1000

/**
 * 
 * @param input 
 * @returns 
 */
export async function createVerificationCode( input: CodeInput ): Promise<string> {

    if (!VERIFICATION_CODE_SECRET) {
        throw new Error('VERIFICATION_CODE_SECRET is not set in .env')
    }

    const { userId, purpose } = input

    const code = crypto.randomInt(0,1_000_000).toString().padStart(6, '0')

    const codeHash = await bcrypt.hash(code + VERIFICATION_CODE_SECRET, 10)

    const expiresAt = new Date(Date.now() + VERIFICATION_CODE_EXPIRES_IN)

    await VerificationCode.findOneAndUpdate(
        { userId, purpose },
        { codeHash, expiresAt, attempts: 0, createdAt: new Date() },
        { upsert: true }
    )
    
    return code

}

/**
 * 
 * @param input 
 * @returns 
 */
export async function verifyCode ( input: VerifyCodeInput): Promise<boolean> {

    if ( !VERIFICATION_CODE_SECRET ) {
        throw new Error('VERIFICATION_CODE_SECRET is not set in .env')
    }

    const { userId, purpose, code, } = input

    const record = await VerificationCode.findOneAndUpdate(
        {
            userId,
            purpose,
            attempts: { $lt: MAX_CODE_ATTEMPTS },
            expiresAt: { $gt: new Date() },
        },
        { $inc: { attempts: 1 } }
    )

    if ( !record ) {

        return false

    }

    const isMatch = await bcrypt.compare(code + VERIFICATION_CODE_SECRET, record.codeHash)

    if ( !isMatch ) {

        return false

    }

    await VerificationCode.deleteOne({ _id: record._id })

    return true

}