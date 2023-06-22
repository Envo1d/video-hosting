import { NextFunction, Request, Response } from 'express'
import { getAll } from '../services/post.service'

export const index = async (
	req: Request, 
	res: Response, 
	next: NextFunction
) => {
	try {
			const posts = getAll()
			res.status(200).json({
				posts
			})
	} catch (error) {
		next(error)
	}
}