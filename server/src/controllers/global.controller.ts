import { NextFunction, Request, Response } from 'express'
import { getRandom } from '../services/post.service'
import { getFollowing, getSuggested } from '../services/subscription.service'

export const getRandomUsers= async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try{
		const user = res.locals.user
		const suggested = await getSuggested(5, user.id)
		const following = await getFollowing(10, user.id)

		res.status(200).json({
			suggested: suggested,
			following: following.map(fol=>fol.subscribedTo)
		})
	}catch(error)
	{
		next(error)
	}
}

export const getRandomPosts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const posts = await getRandom()
		
		res.status(200).json({
			posts
		})
} catch (error) {
	next(error)
}
}