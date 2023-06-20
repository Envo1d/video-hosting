import { NextFunction, Request, Response } from 'express'
import { User } from '../entities/user.entity'
import { createPost, getById } from '../services/post.service'

export const uploadPost = async (
	req: Request, 
	res: Response, 
	next: NextFunction) => {
		try {
			const user = res.locals.user as User
			const {text} = req.body
			const filePath = process.env.APP_URL+'/videos/'+req.file?.filename as string
			
			await createPost(user.id, filePath, text)

			res.status(200).json({
				status: 'success'
			});
		} catch (error) {
			next(error);
		}
}

export const getPostsById = async (
	req: Request, 
	res: Response, 
	next: NextFunction) => {
		try {
			const {userId} = req.body
			
			const posts = await getById(userId)

			res.status(200).json({
				posts: posts
			});
		} catch (error) {
			next(error);
		}
}