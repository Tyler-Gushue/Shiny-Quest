import { Router } from 'express'
import { signupController, loginController, refreshController, logoutController, meController, verifyEmailController } from '../controllers/auth.controller.js'
import { validateSignup, validateLogin, validateVerifyEmail } from '../middleware/validateAuth.js'
import { checkOrigin } from '../middleware/checkOrigin.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { loginIpLimiter, loginAccountLimiter, registerLimiter, verifyEmailLimiter } from '../middleware/rateLimiters.js'

const router = Router()

router.post( '/signup', registerLimiter, validateSignup, signupController )
router.post( '/login', loginIpLimiter, loginAccountLimiter, validateLogin, loginController ) 
router.post( '/refresh', checkOrigin, refreshController )
router.post( '/logout', checkOrigin, logoutController )
router.get( '/me', requireAuth, meController )
router.post( '/verify-email', verifyEmailLimiter, validateVerifyEmail, verifyEmailController )

export default router