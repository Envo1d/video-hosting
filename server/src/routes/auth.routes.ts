import { Router } from 'express'
import {
	login,
	logout,
	refreshAccessToken,
	register
} from '../controllers/auth.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'
import { validate } from '../middleware/validate'
import { createUserSchema, loginUserSchema } from '../schemas/user.schema'

const router = Router()

router.post('/register', validate(createUserSchema), register)
router.post('/login', validate(loginUserSchema), login)
router.get('/logout', deserializeUser, requireUser, logout)
router.get('/refresh', refreshAccessToken)

export default router