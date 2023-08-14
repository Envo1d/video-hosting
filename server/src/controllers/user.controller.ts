import { NextFunction, Request, Response } from 'express'
import { unlink } from 'fs'
import { join } from 'path'
import { User } from '../entities/user.entity'
import { UpdateProfileInput } from '../schemas/user.schema'
import { getFullUser, getUserBackImageById, getUserImageById, updateUserBackImage, updateUserImage, updateUserProfile } from '../services/user.service'

export const getMe = async (
	req: Request,
	res: Response,
	next: NextFunction
)=>{
	try {
		const userId = res.locals.user.id;
		const users = await getFullUser(userId)
		const user = users[0]
		res.status(200).json({
				id: user?.id,
				name: user?.name,
				image: user?.image,
				bio: user?.bio,
				nickname: user?.nickname,
				link: user?.link,
				backgroundImage: user?.profileBackgroundImage,
				subscribers: user?.subscribers.map(sub=>sub.subscriberId),
				subscriptions: user?.subscriptions.map(sub=>sub.subscribedToId)
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
			if(oldImage && !oldImage?.includes('default.jpg')) {
				unlink(join(__dirname.replace('\\controllers', ''), 'public', oldImage.substring(oldImage.indexOf('/images/'))), (err)=> { if(err) throw err })
			}
			await updateUserImage(user.id,  process.env.APP_URL+'/images/'+user.image)

			res.status(200).json({
				status: 'success'
			});
		} catch (error) {
			next(error);
		}
}

export const updateProfileBackImage = async (
	req: Request, 
	res: Response, 
	next: NextFunction) => {
		try {
			const user = res.locals.user as User

			const oldImage = await getUserBackImageById(user.id)
			if(oldImage && oldImage !== '') {
				unlink(join(__dirname.replace('\\controllers', ''), 'public', oldImage.substring(oldImage.indexOf('/images/'))), (err)=> { if(err) throw err })
			}
			await updateUserBackImage(user.id,  process.env.APP_URL+'/images/'+req.file?.filename as string)

			res.status(200).json({
				status: 'success'
			});
		} catch (error) {
			next(error);
		}
}