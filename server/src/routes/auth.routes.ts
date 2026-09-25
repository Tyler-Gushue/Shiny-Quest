import { Router } from 'express'
import { signupController, loginController, refreshController } from '../controllers/auth.controller.js'
import { validateSignup, validateLogin } from '../middleware/validateSignup.js'

const router = Router()

router.post( '/signup', validateSignup, signupController )
router.post( '/login', validateLogin, loginController ) 
router.post( '/refresh', refreshController )

export default router