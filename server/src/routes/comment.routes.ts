import { Router } from 'express'
import { addComment, removeComment } from '../controllers/comment.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'
import { validate } from '../middleware/validate'
import { createCommentSchema, deleteCommentSchema } from '../schemas/comment.schema'

const router = Router()

router.post('/', deserializeUser, requireUser, validate(createCommentSchema), addComment)
router.delete('/', deserializeUser, requireUser, validate(deleteCommentSchema), removeComment)

export default router