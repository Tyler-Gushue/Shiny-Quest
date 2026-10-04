import { Schema, model, Types } from 'mongoose'

export interface IRefreshToken {
  tokenHash: string
  userId: Types.ObjectId
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true }
)

export const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema)