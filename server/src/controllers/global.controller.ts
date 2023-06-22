import { NextFunction, Request, Response } from 'express'
import { getRandomAmount } from '../services/user.service'

export const getRandomUsers= async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try{
		const user = res.locals.user
		const suggested = await getRandomAmount(5, user.id)
		const following = await getRandomAmount(10, user.id)

		res.status(200).json({
			suggested: suggested,
			following: following
		})
	}catch(error)
	{
		next(error)
	}
}