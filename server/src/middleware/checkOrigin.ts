import type { Request, Response, NextFunction } from 'express'

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

export function checkOrigin ( req: Request, res: Response, next: NextFunction ) {

    const origin = req.get('Origin')

    if (origin && origin !== CLIENT_ORIGIN) {

        return res.status(403).json({ message: 'Forbidden' })

    }    

    next()

}