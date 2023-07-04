import { NextFunction, Request, Response } from 'express'
import { getByPostId } from '../services/comment.service'
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

				// FIXME: comments

				for (let i = 0; i < posts.length; i++) {
					const post = posts[i]
					post.comments = await getByPostId(post.id)					
				}
				
				const users = await getFullUser(id as string)
				const user = users[0]

				res.status(200).json({
					posts: posts,
					user: {
						id: user?.id,
						bio: user?.bio,
						name: user?.name,
						image: user?.image,
						backgroundImage: user?.profileBackgroundImage,
						subscribers: user?.subscribers.length,
						subscriptions: user?.subscriptions.length
					}
				})
			}
			else return next(new AppError(400, 'User not found'))
	} catch (error) {
		next(error)
	}
}