import { Router } from 'express'
import { show } from '../controllers/profile.controller'

const router = Router()

router.get('/', show)

export default router