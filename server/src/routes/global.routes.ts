import { Router } from 'express'
import { getRandomPosts, getRandomUsers } from '../controllers/global.controller'
import { index } from '../controllers/home.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'

const router = Router()

router.get('/get-random-users', deserializeUser, requireUser, getRandomUsers)
router.get('/home', index)
router.get('/random', getRandomPosts)

export default router