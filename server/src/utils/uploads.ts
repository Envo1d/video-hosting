import { mkdir, unlink } from 'node:fs/promises'
import path from 'node:path'

export const publicDirectory = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'src/public'))

export const prepareUploads = async () => {
	await Promise.all(['images', 'videos'].map(directory => mkdir(path.join(publicDirectory, directory), { recursive: true })))
}

export const removeUpload = async (filePath: string) => {
	try {
		await unlink(filePath)
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
	}
}

export const uploadPathFromUrl = (url: string) => {
	const pathname = new URL(url, 'http://localhost').pathname
	return path.join(publicDirectory, pathname.startsWith('/videos/') ? 'videos' : 'images', path.basename(pathname))
}
