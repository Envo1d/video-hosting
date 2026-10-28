import { Router } from 'express'
import { follow, getFollowingUsersPosts, listFollowing, listFollowers, unfollow } from '../controllers/subscription.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'
import { validate } from '../middleware/validate'
import { createSubSchema, deleteSubSchema } from '../schemas/subscription.schema'

const router = Router()
router.use(deserializeUser, requireUser)

router.post('/', validate(createSubSchema), follow)
router.delete('/', validate(deleteSubSchema), unfollow)
router.get('/following', listFollowing)
router.get('/followers', listFollowers)
router.get('/following-posts', getFollowingUsersPosts)


export default router
