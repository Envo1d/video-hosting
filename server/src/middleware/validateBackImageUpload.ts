import { NextFunction, Request, Response } from 'express'
import AppError from '../utils/appError'

export const validateBackImageUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
		const file = req?.file

		if(!file)
		return next(
			new AppError(400, `The image field required`)
		);

    next();
  } catch (err: any) {
    next(err);
  }
};
