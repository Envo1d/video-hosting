import { NextFunction, Request, Response } from 'express'
import { getByUserId } from '../services/post.service'
import { getFullUser } from '../services/user.service'
import AppError from '../utils/appError'

export const show = async (
	req: Request, 
	res: Response, 
	next: NextFunction
) => {
	try {
			const id  = req.query.id
			if(id)
			{
				const posts = await getByUserId(id as string)
				const user = await getFullUser(id as string)

				res.status(200).json({
					posts: posts,
					user: {
						id: user?.id,
						bio: user?.bio,
						name: user?.name,
						image: user?.image
					}
				})
			}
			else return next(new AppError(400, 'User not found'))
	} catch (error) {
		next(error)
	}
}