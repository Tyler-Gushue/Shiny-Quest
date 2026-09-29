import { Schema, model, Types } from 'mongoose'

export interface IVerificationCode {
  userId: Types.ObjectId
  codeHash: string
  purpose: 'email_verification' | 'password_reset'
  attempts: number
  expiresAt: Date
  createdAt: Date
}

const verificationCodeSchema = new Schema<IVerificationCode>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        codeHash: {
            type: String,
            required: true,
        },
        purpose: {
            type: String,
            enum: ['email_verification', 'password_reset'],
            required: true,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
            required: true,
            expires: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
)

verificationCodeSchema.index({ userId: 1, purpose: 1 }, { unique: true })

export const VerificationCode = model<IVerificationCode>('VerificationCode', verificationCodeSchema)