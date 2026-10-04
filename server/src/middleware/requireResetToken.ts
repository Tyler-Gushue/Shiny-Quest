import type { Request, Response, NextFunction } from 'express'
import { verifyResetToken } from '../services/auth.service.js'
import { User } from '../models/User.js'

export async function requireResetToken ( req: Request, res: Response, next: NextFunction ) {

    const header = req.get('Authorization')

    if ( !header || !header.startsWith('Bearer ') ) {

        return res.status(401).json({ message: 'Unauthorized' })

    }

    const token = header.split(" ")[1]

    try {

        const { userId, iat } = verifyResetToken(token)

        const user = await User.findById(userId)

        if ( !user ) {

            return res.status(401).json({ message: 'Invalid or expired reset token' })

        }

        if ( user.passwordLastUpdated && user.passwordLastUpdated.getTime() > iat * 1000 ) {

            return res.status(401).json({ message: 'Invalid or expired reset token' })

        }

        req.userId = userId

        next()

    } catch (err) {

        return res.status(401).json({ message: 'Invalid or expired reset token' })

    }

}