import type { Request, Response, NextFunction } from 'express'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/
const CODE_REGEX = /^\d{6}$/

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export function validateSignup ( req: Request, res: Response, next: NextFunction ) {

    const { username, email, password, confirmPassword } = req.body

    if ( typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string' ) {

        return res.status(400).json( { message: 'All fields are required' } )

    }

    if ( username.length < 3 || username.length > 20 ) {

        return res.status(400).json( { message: 'username must be 3-20 characters in length' } )

    }

    if ( !EMAIL_REGEX.test(email) ) {

        return res.status(400).json( { message: 'Email has invalid format' } )

    }

    if ( !PASSWORD_REGEX.test(password) ) {

        return res.status(400).json( { message: 'Password must be 8 to 72 characters long, one lowercase letter, one uppercase letter, and atleast one number' } )

    }

    if ( password !== confirmPassword ) {

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

    const { email, password } = req.body

    if ( typeof email !== 'string' || typeof password !== 'string' ) {

        return res.status(400).json( { message: 'All fields are required' } )

    }

    if ( !EMAIL_REGEX.test(email) ) {

        return res.status(400).json( { message: 'Email has invalid format' } )

    }

    next()

}


export function validateVerifyEmail ( req: Request, res: Response, next: NextFunction ) {

    const { email, code } = req.body

    if ( typeof email !== 'string' || typeof code !== 'string' ) {

        return res.status(400).json( { message: 'Email and code are required' } )

    }

    if ( !EMAIL_REGEX.test(email) ) {

        return res.status(400).json( { message: 'Email has invalid format' } )

    }

    if ( !CODE_REGEX.test(code) ) {

        return res.status(400).json( { message: 'code must be 6 digits' } )

    }

    next()

}

export function validateSendVerificationCode ( req: Request, res: Response, next: NextFunction ){

    const { email } = req.body

    if ( typeof email !== 'string' ) {

        return res.status(400).json( { message: 'Email is required' } )

    }

    if ( !EMAIL_REGEX.test(email) ) {

        return res.status(400).json( { message: 'Email has invalid format' } )

    }

    next()

}