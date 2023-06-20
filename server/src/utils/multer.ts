import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const storage = multer.diskStorage({
	destination: (
		request: Request,
		file: Express.Multer.File,
		callback: DestinationCallback
	): void => {
		if(file.mimetype === 'video/mp4')
		callback(null, path.resolve(__dirname.replace('\\utils', ''), 'public/videos/'))
		else
		callback(null, path.resolve(__dirname.replace('\\utils', ''), 'public/images/'))
	},

	filename: (
		req: Request,
		file: Express.Multer.File,
		callback: FileNameCallback
	): void => {
		callback(null, Date.now().toString()+file.originalname)
	}
})

export const imageFilter = (
	request: Request,
	file: Express.Multer.File,
	callback: FileFilterCallback
): void => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
) {
		callback(null, true)
} else {
		callback(null, false)
}
}

export const videoFilter = (
	request: Request,
	file: Express.Multer.File,
	callback: FileFilterCallback
): void => {
	if (file.mimetype === 'video/mp4') {
		callback(null, true)
} else {
		callback(null, false)
}
}
