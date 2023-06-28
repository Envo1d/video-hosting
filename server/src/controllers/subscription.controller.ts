import { NextFunction, Request, Response } from 'express'
import { getByPostId } from '../services/comment.service'
import { addSubscription, getFollowingPosts, removeSubscription } from '../services/subscription.service'
import AppError from '../utils/appError'

export const follow = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try{
		const { id } = req.body
		const user = res.locals.user

		await addSubscription(id, user.id)

		res.status(200).json({
			status: 'success'
		})
	}catch(error)
	{
		next(error)
	}
}

export const unfollow = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try{
		const { id } = req.body
		const user = res.locals.user

		const result = await removeSubscription(id, user.id)
		if(result === undefined)
			return next(new AppError(500, 'Server error'))
		res.status(200).json({
			status: 'success'
		})
	}catch(error)
	{
		next(error)
	}
}

export const getFollowingUsersPosts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try{
		const user = res.locals.user

		const posts = await getFollowingPosts(user.id)
		
		for (let i = 0; i < posts.length; i++) {
			const post = posts[i]
			post.comments = await getByPostId(post.id)					
		}
		
		res.status(200).json({
			posts: posts
		})
	}catch(error)
	{
		next(error)
	}
}