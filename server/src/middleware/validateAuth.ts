import type { Request, Response, NextFunction } from 'express'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/

export function validateSignup ( req: Request, res: Response, next: NextFunction ) {

    const { username, email, password, confirmPassword } = req.body

    if ( !username || !email || !password || !confirmPassword ) {

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

export function validateLogin ( req: Request, res: Response, next: NextFunction ) {

    const { email, password } = req.body

    if ( !email || !password ) {

        return res.status(400).json( { message: 'All fields are required' } )

    }

    next()

}