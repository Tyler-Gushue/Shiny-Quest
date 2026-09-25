import type { Request, Response } from 'express';
import { signup, login } from '../services/auth.service.js'

const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS) || 7
const isProduction = process.env.NODE_ENV === 'production'

export async function signupController ( req: Request, res: Response ) {

    try {

        const { user, accessToken, refreshToken } = await signup(req.body)

        res.cookie('refreshToken', refreshToken, {
            
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
            path: '/api/auth',
            
        })

        res.status(201).json( { user, accessToken } )


    } catch (err) {

        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })

    }
}

export async function loginController ( req: Request, res: Response ) {

    try {

        const { user, accessToken, refreshToken } = await login(req.body)

        res.cookie('refreshToken', refreshToken, {
            
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
            path: '/api/auth',
            
        })

        res.status(200).json( { user, accessToken } )

    } catch (err) {

        if (err instanceof Error && err.message === 'Invalid email or password') {
            return res.status(401).json({ message: err.message })
        }

        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })

    }

}