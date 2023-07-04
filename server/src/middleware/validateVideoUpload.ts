import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import AppError from '../utils/appError'

export const validateVideoUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {title, description} = req.body
		const files = req?.files as { [fieldname: string]: Express.Multer.File[] };
console.log(files)
    const file = files.file[0]
    const icon = files.icon[0]

    if (!title && !file && !description && !icon)
      return next(
        new AppError(400, `The video, icon, title, description field required`)
      );
		else if(!title)
		{
      fs.unlink(path.resolve(__dirname.replace('\\middleware', ''), 'public/videos/', file?.filename as string), (err) => {if(err) throw err})
      fs.unlink(path.resolve(__dirname.replace('\\middleware', ''), 'public/images/', icon?.filename as string), (err) => {if(err) throw err})

      return next(
			new AppError(400, `The title field required`)
		);
  }
  else if(!description)
		{
      fs.unlink(path.resolve(__dirname.replace('\\middleware', ''), 'public/videos/', file?.filename as string), (err) => {if(err) throw err})
      fs.unlink(path.resolve(__dirname.replace('\\middleware', ''), 'public/images/', icon?.filename as string), (err) => {if(err) throw err})

      return next(
			new AppError(400, `The description field required`)
		);
  }
	else if(!file)
  {
    fs.unlink(path.resolve(__dirname.replace('\\middleware', ''), 'public/images/', icon?.filename as string), (err) => {if(err) throw err})
	return next(
		new AppError(400, `The video field required`)
	);
  }
  else if(!icon)
  {
    fs.unlink(path.resolve(__dirname.replace('\\middleware', ''), 'public/videos/', file?.filename as string), (err) => {if(err) throw err})
	return next(
		new AppError(400, `The icon field required`)
	);
  }

    next();
  } catch (err: any) {
    next(err);
  }
};
