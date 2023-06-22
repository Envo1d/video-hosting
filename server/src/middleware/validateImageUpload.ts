import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import AppError from '../utils/appError'

export const validateImageUpload = async (
  req: Request<{}, {}, {left: string, top: string, width: string, height: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
		const file = req?.file
		const {height, width, top, left} = req.body

		if(!file && (height === '' || width === '' || top === '' || left === ''))
		return next(
			new AppError(400, `The image field required and image size not se properly`)
		);
		else if(!file)
		return next(
			new AppError(400, `The image field required`)
		);

		const filePath = path.join(__dirname.replace('\\middleware', ''), 'public/images/', req.file?.filename as string)
		
		if(height === '' || width === '' || top === '' || left === '') {
			fs.unlink(filePath, (err) => {if(err) throw err})
			return next(new AppError(400, 'Image size not set properly'))
		}

		const image = await sharp(filePath)

		const newFileName = Date.now().toString()+ req?.file?.originalname.substring(0, req?.file?.originalname.indexOf(path.extname(req?.file?.originalname))) + '.jpeg'

		const newFilePath = path.join(__dirname.replace('\\middleware', ''), 'public/images/', newFileName)

		const buffer = await image.extract({left: parseInt(left), top: parseInt(top), width: parseInt(width), height: parseInt(height)}).toBuffer()

		fs.writeFile(newFilePath, buffer, (err)=>{if(err) throw err})

		res.locals.user.image = newFileName

		fs.unlink(filePath, (err) => {if(err) throw err})

    next();
  } catch (err: any) {
    next(err);
  }
};
