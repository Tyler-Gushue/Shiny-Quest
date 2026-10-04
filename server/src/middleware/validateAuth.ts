import type { Request, Response, NextFunction } from 'express'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\x20-\x7E]{8,72}$/
const USERNAME_REGEX = /^[\x21-\x7E]{3,20}$/
const CODE_REGEX = /^\d{6}$/

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export function validateSignup ( req: Request, res: Response, next: NextFunction ) {

    const { username, email, password, confirmPassword } = req.body ?? {}

    if ( typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string' ) {

        return res.status(400).json( { message: 'All fields are required' } )

    }

    if ( !USERNAME_REGEX.test(username.trim()) ) {

        return res.status(400).json({ message: 'invalid username' })

    }

    if ( !EMAIL_REGEX.test(email) ) {

        return res.status(400).json( { message: 'Email has invalid format' } )

    }

    if ( !PASSWORD_REGEX.test(password.trim()) ) {

        return res.status(400).json( { message: 'Password must be 8 to 72 characters long, one lowercase letter, one uppercase letter, and atleast one number' } )

    }

    if ( password.trim() !== confirmPassword.trim() ) {

        return res.status(400).json( { message: 'Password and confirm password do not match' } )

    }

    next()

}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export function validateLogin ( req: Request, res: Response, next: NextFunction ) {

    const { email, password } = req.body ?? {}

    if ( typeof email !== 'string' || typeof password !== 'string' ) {

        return res.status(400).json( { message: 'All fields are required' } )

    }

    if ( !EMAIL_REGEX.test(email) ) {

        return res.status(400).json( { message: 'Email has invalid format' } )

    }

    next()

}

export function validateRefreshCookie ( req: Request, res: Response, next: NextFunction ) {

    if ( typeof req.cookies.refreshToken !== 'string' ) {

        return res.status(401).json({ message: 'invalid cookie' })

    }

    next()

}


export function validateVerifyEmail ( req: Request, res: Response, next: NextFunction ) {

    const { email, code } = req.body ?? {}

    if ( typeof email !== 'string' || typeof code !== 'string' ) {

        return res.status(400).json( { message: 'Email and code are required' } )

    }

    if ( !EMAIL_REGEX.test(email) ) {

        return res.status(400).json( { message: 'Email has invalid format' } )

    }

    if ( !CODE_REGEX.test(code.trim()) ) {

        return res.status(400).json( { message: 'code must be 6 digits' } )

    }

    next()

}

export function validateSendVerificationCode ( req: Request, res: Response, next: NextFunction ){

    const { email } = req.body ?? {}

    if ( typeof email !== 'string' ) {

        return res.status(400).json( { message: 'Email is required' } )

    }

    if ( !EMAIL_REGEX.test(email) ) {

        return res.status(400).json( { message: 'Email has invalid format' } )

    }

    next()

}

export function validateResetPassword ( req: Request, res: Response, next: NextFunction ){

    const { newPassword, confirmPassword} = req.body ?? {}

    if ( typeof newPassword !== 'string' || typeof confirmPassword !== 'string' ) {

        return res.status(400).json( { message: 'password is required' } )

    }

    if ( !PASSWORD_REGEX.test(newPassword.trim()) ) {

        return res.status(400).json( { message: 'Password is invalid' } )

    }

    if ( newPassword.trim() !== confirmPassword.trim() ) {

        return res.status(400).json( { message: 'Password and confirm password must match' } )

    }

    next()

}