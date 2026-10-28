import { NextFunction, Request, Response } from 'express'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import sharp from 'sharp'
import AppError from '../utils/appError'
import { publicDirectory, removeUpload } from '../utils/uploads'

export const validateImageUpload = async (req: Request, res: Response, next: NextFunction) => {
	const file = req.file
	if (!file) return next(new AppError(400, 'The image field is required'))
	try {
		const values = ['left', 'top', 'width', 'height'].map(key => req.body?.[key])
		const [left, top, width, height] = values.map(Number)
		if (values.some(value => value === undefined || value === '') ||
			![left, top, width, height].every(Number.isInteger) || left < 0 || top < 0 || width <= 0 || height <= 0) {
			throw new AppError(400, 'Image crop dimensions must be valid integers')
		}
		const image = sharp(file.path)
		const metadata = await image.metadata()
		if (left + width > (metadata.width || 0) || top + height > (metadata.height || 0)) {
			throw new AppError(400, 'Image crop exceeds the image dimensions')
		}
		const filename = randomUUID() + '.jpeg'
		await image.extract({ left, top, width, height }).jpeg().toFile(path.join(publicDirectory, 'images', filename))
		res.locals.user.image = filename
		await removeUpload(file.path)
		next()
	} catch (error) {
		await removeUpload(file.path).catch(() => undefined)
		next(error instanceof AppError ? error : new AppError(400, 'Invalid image'))
	}
}
