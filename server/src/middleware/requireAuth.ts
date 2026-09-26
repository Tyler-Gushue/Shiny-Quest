import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../services/auth.service.js'

export function requireAuth ( req: Request, res: Response, next: NextFunction ) {

    const header = req.get('Authorization')

    if ( !header || !header.startsWith('Bearer ') ) {

        return res.status(401).json({ message: 'Unauthorized' })

    }

    const token = header.split(" ")[1]

    try {

        req.userId = verifyAccessToken(token)
        next()

    } catch (err) {

        return res.status(401).json({ message: 'Invalid or expired access token' })

    }

}