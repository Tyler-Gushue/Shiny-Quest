import { Router } from 'express'
import { signupController, loginController, refreshController, logoutController, meController, verifyEmailController, verifyResetController, sendEmailVerificationCodeController, sendResetVerificationCodeController } from '../controllers/auth.controller.js'
import { validateSignup, validateLogin, validateVerifyEmail, validateSendVerificationCode } from '../middleware/validateAuth.js'
import { checkOrigin } from '../middleware/checkOrigin.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { loginIpLimiter, loginAccountLimiter, registerLimiter, verifyLimiter, sendVerificationAccountLimiter, sendVerificationIpLimiter } from '../middleware/rateLimiters.js'

const router = Router()

router.post( '/signup', registerLimiter, validateSignup, signupController )
router.post( '/login', loginIpLimiter, loginAccountLimiter, validateLogin, loginController ) 
router.post( '/refresh', checkOrigin, refreshController )
router.post( '/logout', checkOrigin, logoutController )
router.get( '/me', requireAuth, meController )
router.post( '/verify-email', verifyLimiter, validateVerifyEmail, verifyEmailController )
router.post( '/verify-reset', verifyLimiter, validateVerifyEmail, verifyResetController )
router.post( '/email-code', sendVerificationIpLimiter, sendVerificationAccountLimiter, validateSendVerificationCode, sendEmailVerificationCodeController )
router.post( '/reset-code', sendVerificationIpLimiter, sendVerificationAccountLimiter, validateSendVerificationCode, sendResetVerificationCodeController )

export default router