import { NextFunction, Request, Response } from 'express'
import { unlink } from 'fs'
import { join } from 'path'
import { User } from '../entities/user.entity'
import { UpdateProfileInput } from '../schemas/user.schema'
import { getUserImageById, updateUserImage, updateUserProfile } from '../services/user.service'

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
	req: Request<{}, {}, UpdateProfileInput>,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = res.locals.user as User;
		const { name, bio } = req.body;

		await updateUserProfile(user.id, {name, bio})

		res.status(200).json({
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

			const oldImage = await getUserImageById(user.id)
			if(oldImage) {
				const oldImagePath = join(__dirname.replace('\\controllers', ''), 'public/images/', oldImage?.substring(oldImage.indexOf('/images/')+ ('/images').length+1))
				unlink(oldImagePath, (err)=> { if(err) throw err })
			}
			await updateUserImage(user.id,  process.env.APP_URL+'/images/'+user.image)

			res.status(200).json({
				status: 'success'
			});
		} catch (error) {
			next(error);
		}
}