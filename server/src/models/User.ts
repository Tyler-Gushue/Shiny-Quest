import { Schema, model } from 'mongoose'

export interface IUser {
  email: string
  username: string
  passwordHash: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  passwordLastUpdated?: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    passwordLastUpdated: {
      type: Date
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const User = model<IUser>('User', userSchema)