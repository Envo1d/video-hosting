import { NextFunction, Request, Response } from 'express'
import { User } from '../entities/user.entity'
import { CreateLikeInput, DeleteLikeInput } from '../schemas/like.schema'
import { createLikeForPost, deleteLikeForPost, getLikeByIdForPost } from '../services/like.service'
import AppError from '../utils/appError'

export const addLike = async (
	req: Request<{}, {}, CreateLikeInput>,
	res: Response,
	next: NextFunction
) => {
	try{
		const { postId } = req.body
		const user = res.locals.user as User

		const like = await createLikeForPost(user.id, postId)

		res.status(200).json({
			status: 'success',
			like
		})
	}catch(error)
	{
		next(error)
	}
}


export const removeLike = async (
	req: Request<{},{},DeleteLikeInput>,
	res: Response,
	next: NextFunction
) => {
	try{

		const { id } = req.body

		const like = await getLikeByIdForPost(id)
		if(like) {
			await deleteLikeForPost(id)

		res.status(200).json({
			status: 'success',
			like
		})}
		else return next(new AppError(400, 'Like not found'))
	}catch(error)
	{
		next(error)
	}
}