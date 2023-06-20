import { Router } from 'express'
import multer from 'multer'
import { getMe, updateProfile, updateProfileImage } from '../controllers/user.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'
import { validate } from '../middleware/validate'
import { updateProfileSchema } from '../schemas/user.schema'
import { imageFilter, storage } from '../utils/multer'

const upload = multer({storage: storage, fileFilter: imageFilter})

const router = Router()

router.use(deserializeUser, requireUser)

router.get('/me', getMe)
router.post('/update-profile', validate(updateProfileSchema), updateProfile)
router.post('/upload-image', upload.single('file'), updateProfileImage)

export default router