import { Router } from 'express'
import multer from 'multer'
import { deletePost, getPostsByUserId, show, uploadPost } from '../controllers/post.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'
import { validateVideoUpload } from '../middleware/validateVideoUpload'
import { storage, videoFilter } from '../utils/multer'

const upload = multer({storage: storage, fileFilter: videoFilter})

const router = Router()

router.post('/', deserializeUser, requireUser, upload.single('file'), validateVideoUpload,  uploadPost)
router.get('/get-by-id', getPostsByUserId)
router.get('/:id', show)
router.delete('/:id', deserializeUser, requireUser ,deletePost)

export default router