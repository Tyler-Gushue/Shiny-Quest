import type { Request, Response } from 'express';
import { signup, login, refresh, logout, getCurrentUser, verifyEmail } from '../services/auth.service.js'

const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS) || 7
const isProduction = process.env.NODE_ENV === 'production'

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function signupController ( req: Request, res: Response ) {

    try {

        const { email } = await signup(req.body)


        res.status(201).json( { message: "Account created.  Check your email for verification code." } )


    } catch (err) {

        if (err instanceof Error && err.message === 'Email or username already taken') {

                return res.status(409).json({ message: err.message })

        }

        if ((err as any).code === 11000) {

            return res.status(409).json({ message: 'Email or username already taken' })
            
        }

        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })

    }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
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

        if ( err instanceof Error && err.message === 'Invalid email or password' ) {
            return res.status(401).json({ message: err.message })
        }

        if ( err instanceof Error && err.message === 'Email is not verified' ) {
            return res.status(403).json({ message: err.message })
        }

        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })

    }

}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function refreshController( req: Request, res: Response ) {

    const token = req.cookies.refreshToken

    if ( !token ) {

        return res.status(401).json({ message: 'No session' })

    }

    try {

        const { user, accessToken } = await refresh(token)

        res.status(200).json({ user, accessToken })

    } catch (err) {

        if ( err instanceof Error && err.message === 'Invalid refresh token') {

            res.clearCookie('refreshToken', { path: '/api/auth' })
            return res.status(401).json({ message: 'Session expired, please log in again' })

        }

        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })

    }
    
}

/**
 * 
 * @param req 
 * @param res 
 */
export async function logoutController( req: Request, res: Response ) {

    const token = req.cookies.refreshToken

    try {

        if ( token ) {

            await logout(token)

        }

        res.clearCookie('refreshToken', { path: '/api/auth' })
        res.status(200).json({ message: 'Logged out successfully' })

    } catch (err) {

        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })

    }

}    

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function meController ( req: Request, res: Response ) {

    try {

        const user = await getCurrentUser(req.userId!)
        res.status(200).json({ user })

    } catch (err) {

        
        if ( err instanceof Error && err.message === 'User not found' ) {

            return res.status(404).json({ message: err.message })

        }

        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })

    }

}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function verifyEmailController ( req: Request, res: Response ) {

    try {

        const { user, accessToken, refreshToken } = await verifyEmail(req.body)

        res.cookie('refreshToken', refreshToken, {

            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
            path: '/api/auth'
            
        })

        res.status(200).json( { user, accessToken } )

    } catch (err) {

        if ( err instanceof Error && err.message === 'Invalid or expired code' ) {

            return res.status(400).json({ message: err.message })

        }

        if ( err instanceof Error && err.message === 'Email already verified' ) {

            return res.status(409).json({ message: err.message })

        }

        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })

    }

}