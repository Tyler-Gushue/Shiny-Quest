import { Router } from 'express'
import { signupController, loginController, refreshController, logoutController, meController } from '../controllers/auth.controller.js'
import { validateSignup, validateLogin } from '../middleware/validateAuth.js'
import { checkOrigin } from '../middleware/checkOrigin.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.post( '/signup', validateSignup, signupController )
router.post( '/login', validateLogin, loginController ) 
router.post( '/refresh', checkOrigin, refreshController )
router.post( '/logout', checkOrigin, logoutController )
router.get( '/me', requireAuth, meController )

export default router