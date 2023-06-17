import { Router } from 'express'
import { getMe } from '../controllers/auth.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'

const router = Router()

router.use(deserializeUser, requireUser)

router.get('/me', getMe)

export default router