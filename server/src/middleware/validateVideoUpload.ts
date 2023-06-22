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
    const {text} = req.body
		const file = req?.file

    if (!text && !file)
      return next(
        new AppError(400, `The video and text field required`)
      );
		else if(!text)
		{
      fs.unlink(path.resolve(__dirname.replace('\\middleware', ''), 'public/videos/', file?.filename as string), (err) => {if(err) throw err})

      return next(
			new AppError(400, `The text field required`)
		);
  }
		else if(!file)
		return next(
			new AppError(400, `The video field required`)
		);

    next();
  } catch (err: any) {
    next(err);
  }
};
