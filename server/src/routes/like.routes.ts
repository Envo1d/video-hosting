import { Router } from 'express'
import { addLike, removeLike } from '../controllers/like.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'
import { validate } from '../middleware/validate'
import { createLikeSchema, deleteLikeSchema } from '../schemas/like.schema'

const router = Router()

router.post('/', deserializeUser, requireUser, validate(createLikeSchema), addLike)
router.delete('/', deserializeUser, requireUser, validate(deleteLikeSchema), removeLike)

export default router