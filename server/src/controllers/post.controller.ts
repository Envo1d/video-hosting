import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import { join } from 'path'
import { User } from '../entities/user.entity'
import { getByPostId } from '../services/comment.service'
import { createPost, getById, getByIdAndUserId, getByUserId, remove, updateRepostsCounter } from '../services/post.service'
import AppError from '../utils/appError'

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

export const getPostsByUserId = async (
	req: Request, 
	res: Response, 
	next: NextFunction) => {
		try {
			const {userId} = req.body
			
			const posts = await getByUserId(userId)

			res.status(200).json({
				posts: posts
			});
		} catch (error) {
			next(error);
		}
}

export const show = async (
	req: Request, 
	res: Response, 
	next: NextFunction
) => {
	try {
		const id = req.query.id as string

		if(id !== undefined)
		{
			const post = await getById(id)
			if(post) {
				// FIXME: comments
				const comments = await getByPostId(id)
				post.comments = comments
				
				const postsIds = await getByUserId(post?.user.id as string)
				const ids = postsIds.map(post=>post.id)

				res.status(200).json({
					post: post,
					ids: ids
				});
			}
			else return next(new AppError(400, 'Post not found'))
		}
		else return next(new AppError(404, 'Post id incorrect'))
	} catch (error) {
		next(error)
	}
}

export const deletePost = async (
	req: Request, 
	res: Response, 
	next: NextFunction
) => {
	try {
		const { id } = req.query
		const user = res.locals.user as User
	
		if(id !== undefined)
		{
			const post = await getByIdAndUserId(id as string, user.id)

			if(post)
			{
				await fs.unlink(join(__dirname.replace('\\controllers', ''), 'public', post?.videoUrl.substring(post?.videoUrl.indexOf('/videos/'))), (err) => { if(err) throw err })

				await remove(post.id)

				res.status(200).json({
					status: 'success'
				});
		}
			else return next(new AppError(404, 'Post not found'))
		}
		else return next(new AppError(404, 'Post not found'))
	} catch (error) {
		next(error)
	}
}

export const updateCounter = async (
	req: Request, 
	res: Response, 
	next: NextFunction
) => {
	try {
		const id = req.query.id as string
		
		if(id !== undefined)
		{
			await updateRepostsCounter(id)

			res.status(200).json({
				status: 'success'
			});
		}
		else return next(new AppError(404, 'Post id incorrect'))
	} catch (error) {
		next(error)
	}
}