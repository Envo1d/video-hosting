import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import AppError from './appError'
import { publicDirectory } from './uploads'

export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024
const imageTypes = new Set(['image/png', 'image/jpg', 'image/jpeg'])

export const storage = multer.diskStorage({
	destination: (_request, file, callback) => {
		callback(null, path.join(publicDirectory, file.mimetype === 'video/mp4' ? 'videos' : 'images'))
	},
	filename: (_request, file, callback) => {
		callback(null, randomUUID() + path.extname(file.originalname))
	}
})

export const imageFilter = (_request: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
	if (imageTypes.has(file.mimetype)) callback(null, true)
	else callback(new AppError(400, 'Only PNG and JPEG images are allowed'))
}

export const videoFilter = (_request: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
	if ((file.fieldname === 'file' && file.mimetype === 'video/mp4') ||
		(file.fieldname === 'icon' && imageTypes.has(file.mimetype))) callback(null, true)
	else callback(new AppError(400, 'An MP4 video and a PNG or JPEG icon are required'))
}
