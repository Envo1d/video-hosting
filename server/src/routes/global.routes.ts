import { Router } from 'express'
import { getRandomUsers } from '../controllers/global.controller'

const router = Router()

router.get('/get-random-users', getRandomUsers)

export default router