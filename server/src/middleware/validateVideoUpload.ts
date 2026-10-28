import { NextFunction, Request, Response } from 'express'
import AppError from '../utils/appError'
import { removeUpload } from '../utils/uploads'

export const validateVideoUpload = async (req: Request, _res: Response, next: NextFunction) => {
	const files = (req.files || {}) as Record<string, Express.Multer.File[]>
	if (!req.body?.title || !req.body?.description || !files.file?.[0] || !files.icon?.[0]) {
		try {
			await Promise.all(Object.values(files).flat().map(file => removeUpload(file.path)))
			next(new AppError(400, 'The video, icon, title and description fields are required'))
		} catch (error) { next(error) }
		return
	}
	next()
}
