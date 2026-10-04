import { Router } from 'express'
import { signupController, loginController, refreshController, logoutController, meController, verifyEmailController, verifyResetController, sendEmailVerificationCodeController, sendResetVerificationCodeController, resetPasswordController } from '../controllers/auth.controller.js'
import { validateSignup, validateLogin, validateRefreshCookie, validateVerifyEmail, validateSendVerificationCode, validateResetPassword } from '../middleware/validateAuth.js'
import { checkOrigin } from '../middleware/checkOrigin.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireResetToken } from '../middleware/requireResetToken.js'
import { loginIpLimiter, loginAccountLimiter, registerLimiter, verifyLimiter, sendVerificationAccountLimiter, sendVerificationIpLimiter, resetPasswordLimiter, sendResetIpLimiter, sendResetAccountLimiter } from '../middleware/rateLimiters.js'

const router = Router()

router.post( '/signup', registerLimiter, validateSignup, signupController )
router.post( '/login', loginIpLimiter, loginAccountLimiter, validateLogin, loginController ) 
router.post( '/refresh', checkOrigin, validateRefreshCookie, refreshController )
router.post( '/logout', checkOrigin, logoutController )
router.get( '/me', requireAuth, meController )
router.post( '/verify-email', verifyLimiter, validateVerifyEmail, verifyEmailController )
router.post( '/verify-reset', verifyLimiter, validateVerifyEmail, verifyResetController )
router.post( '/email-code', sendVerificationIpLimiter, sendVerificationAccountLimiter, validateSendVerificationCode, sendEmailVerificationCodeController )
router.post( '/reset-code', sendResetIpLimiter, sendResetAccountLimiter, validateSendVerificationCode, sendResetVerificationCodeController )
router.post( '/reset-password',  requireResetToken, resetPasswordLimiter, validateResetPassword, resetPasswordController)

export default router