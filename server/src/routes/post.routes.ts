import { Router } from 'express'
import multer from 'multer'
import { deletePost, getPostsByUserId, show, updateCounter, uploadPost } from '../controllers/post.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'
import { validateVideoUpload } from '../middleware/validateVideoUpload'
import { storage, videoFilter } from '../utils/multer'

const upload = multer({storage: storage, fileFilter: videoFilter})

const router = Router()

router.post('/', deserializeUser, requireUser, upload.fields([{
	name: 'file', maxCount: 1
}, {name: 'icon', maxCount: 1}]), validateVideoUpload,  uploadPost)
router.get('/get-by-id', getPostsByUserId)
router.get('/', show)
router.delete('/', deserializeUser, requireUser ,deletePost)
router.put('/', deserializeUser, requireUser, updateCounter)

export default router