import { NextFunction, Request, Response } from 'express'
import { User } from '../entities/user.entity'
import { CreateCommentInput, DeleteCommentInput } from '../schemas/comment.schema'
import { createComment, deleteComment } from '../services/comment.service'
import AppError from '../utils/appError'

export const addComment = async (
	req: Request<{}, {}, CreateCommentInput>,
	res: Response,
	next: NextFunction
) => {
	try{
		const user = res.locals.user as User
		const { postId, text } = req.body

		await createComment(user.id, postId, text)

		res.status(200).json({
			status: 'success'
		})
	}catch(error)
	{
		next(error)
	}
}


export const removeComment = async (
	req: Request<{},{},DeleteCommentInput>,
	res: Response,
	next: NextFunction
) => {
	try{
		const result = await deleteComment(req.body.id, res.locals.user.id)
		if (!result.affected) return next(new AppError(404, 'Comment not found'))

		res.status(200).json({
			status: 'success'
		})
	}catch(error)
	{
		next(error)
	}
}
