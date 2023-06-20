import { NextFunction, Request, Response } from 'express'
import { unlink } from 'fs'
import sizeOf from 'image-size'
import path from 'path'
import { User } from '../entities/user.entity'
import { updateUserImage, updateUserProfile } from '../services/user.service'
import AppError from '../utils/appError'

export const getMe = async (
	req: Request,
	res: Response,
	next: NextFunction
)=>{
	try {
		const user = res.locals.user as User;

		res.status(200).json({
			...user
		});
	} catch (error) {
		next(error);
	}
}

export const updateProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = res.locals.user as User;
		const { name, bio } = req.body;

		await updateUserProfile(user.id, {name, bio})

		res.status(201).json({
      status: 'success',
    });

	} catch (error) {
		next(error)
	}
}

export const updateProfileImage = async (
	req: Request, 
	res: Response, 
	next: NextFunction) => {
		try {
			const user = res.locals.user as User

			const filePath = path.join(__dirname.replace('\\controllers', ''), 'public/images/', req.file?.filename as string)
			
			const dimensions = sizeOf(filePath)
			if(dimensions.height !== dimensions.width) {
				unlink(filePath, () => {return next(new AppError(500, 'Server error'))})
				return next(new AppError(400, 'Incorrect image size'))
			}
			
			await updateUserImage(user.id, path.join(__dirname, 'public/images', req.file?.filename as string))

			res.status(200).json({
				status: 'success'
			});
		} catch (error) {
			next(error);
		}
}