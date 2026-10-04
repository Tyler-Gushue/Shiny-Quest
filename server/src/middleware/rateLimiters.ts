import rateLimit from 'express-rate-limit';
import { ipKeyGenerator } from 'express-rate-limit';

export const globalLimiter = rateLimit ({

    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false, 
    message: { message: 'Too many requests, please try again later.' } 

});

export const loginIpLimiter = rateLimit ({

    windowMs: 15 * 60 * 1000,
    limit: 20,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false, 
    message: { message: 'Too many login attempts, please try again later.' }    

});

export const loginAccountLimiter = rateLimit ({

    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    skipSuccessfulRequests: true,
    legacyHeaders: false, 
    message: { message: 'Too many login attempts for this account, please try again later.' },

    keyGenerator: (req, res) => {

        const ipKey = ipKeyGenerator(req.ip ?? '');

        const email = req.body?.email;

        if ( typeof email !== 'string' ) {

            return ipKey;

        }

        const normalizedEmail = email.trim().toLowerCase();

        return `${ipKey}:${normalizedEmail}`;

    }

});

export const registerLimiter = rateLimit ({

    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many registration attempts, please try again later.' }

});

export const verifyLimiter = rateLimit ({

    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many verification attempts, please try again later.'}

})

export const sendVerificationIpLimiter = rateLimit ({

    windowMs: 30 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false, 
    message: { message: 'Too many resend requests, please try again later.' }    

});

export const sendVerificationAccountLimiter = rateLimit ({

    windowMs: 30 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false, 
    message: { message: 'Too many resend requests, please try again later.' },

    keyGenerator: (req, res) => {

        const ipKey = ipKeyGenerator(req.ip ?? '');

        const email = req.body?.email;

        if ( typeof email !== 'string' ) {

            return ipKey;

        }

        const normalizedEmail = email.trim().toLowerCase();

        return normalizedEmail;

    }

});

export const sendResetIpLimiter = rateLimit ({

    windowMs: 30 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false, 
    message: { message: 'Too many reset code requests, please try again later.' }    

});

export const sendResetAccountLimiter = rateLimit ({

    windowMs: 30 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false, 
    message: { message: 'Too many reset code requests, please try again later.' },

    keyGenerator: (req, res) => {

        const ipKey = ipKeyGenerator(req.ip ?? '');

        const email = req.body?.email;

        if ( typeof email !== 'string' ) {

            return ipKey;

        }

        const normalizedEmail = email.trim().toLowerCase();

        return normalizedEmail;

    }

});

export const resetPasswordLimiter = rateLimit ({

    windowMs: 30 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false, 
    message: { message: 'Too many change password attempts, please try again later.' },

    keyGenerator: (req, res) => {

        const ipKey = ipKeyGenerator(req.ip ?? '');

        const userId = req.userId;

        if ( typeof userId !== 'string' ) {

            return ipKey;

        }

        return userId;

    }

})
