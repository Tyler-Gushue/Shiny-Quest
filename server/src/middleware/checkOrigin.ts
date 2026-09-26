import type { Request, Response, NextFunction } from 'express'

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

export function checkOrigin ( req: Request, res: Response, next: NextFunction ) {

    const origin = req.get('Origin')

    if (origin && origin !== CLIENT_URL) {

        return res.status(403).json({ message: 'Forbidden' })

    }    

    next()

}