import { Router } from 'express'
import { getRandomUsers } from '../controllers/global.controller'
import { index } from '../controllers/home.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'

const router = Router()

router.get('/get-random-users', deserializeUser, requireUser, getRandomUsers)
router.get('/home', index)

export default router