import { NextFunction, Request, Response } from 'express'
import { getByPostId } from '../services/comment.service'
import { getAll } from '../services/post.service'

export const index = async (
	req: Request, 
	res: Response, 
	next: NextFunction
) => {
	try {
			const posts = await getAll()
			
			for (let i = 0; i < posts.length; i++) {
				const post = posts[i]
				post.comments = await getByPostId(post.id)					
			}
			res.status(200).json({
				posts
			})
	} catch (error) {
		next(error)
	}
}