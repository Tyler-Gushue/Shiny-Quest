import { Router } from 'express'
import { signupController, loginController } from '../controllers/auth.controller.js'
import { validateSignup, validateLogin } from '../middleware/validateSignup.js'

const router = Router()

router.post( '/signup', validateSignup, signupController)
router.post( '/login', validateLogin, loginController ) 

export default router