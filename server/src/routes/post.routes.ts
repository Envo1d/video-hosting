import { Router } from 'express'
import multer from 'multer'
import { getPostsById, uploadPost } from '../controllers/post.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'
import { storage, videoFilter } from '../utils/multer'

const upload = multer({storage: storage, fileFilter: videoFilter})

const router = Router()

router.post('/add-post', deserializeUser, requireUser, upload.single('file'), uploadPost)
router.get('/get-by-id', getPostsById)

export default router