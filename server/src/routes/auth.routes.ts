import { Router } from 'express'
import { signupController } from '../controllers/auth.controller.js'
import { validateSignup } from '../middleware/validateSignup.js'

const router = Router()

router.post( '/signup', validateSignup, signupController)

export default router