import config from 'config'
import { CookieOptions, NextFunction, Request, Response } from 'express'
import { User } from '../entities/user.entity'
import { CreateUserInput, LoginUserInput } from '../schemas/user.schema'
import { createUser, findUserByEmail, findUserById, signTokens } from '../services/user.service'
import AppError from '../utils/appError'
import redisClient from '../utils/connectRedis'
import { signJwt, verifyJwt } from '../utils/jwt'

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>('refreshTokenExpiresIn') * 24 * 60 * 60 * 1000
  ),
  maxAge: config.get<number>('refreshTokenExpiresIn')  * 24 * 60 * 60 * 1000,
};

export const register = async (
	req: Request<{}, {}, CreateUserInput>, 
	res: Response,
	next: NextFunction) => {
	try {
		const { name, password, email, nickname } = req.body;

    const user = await createUser({
      name,
			nickname,
      email: email.toLowerCase(),
      password,
    });
		
		const { access_token, refresh_token } = await signTokens(user);

		res.cookie('access_token', access_token, accessTokenCookieOptions);
		res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
		res.cookie('logged_in', true, {
			...accessTokenCookieOptions,
			httpOnly: false,
		});

		res.status(201).json({
      status: 'success',
    });
	} catch (error: any) {
		if(error.code === '23505') {
			return res.status(409).json({
				status: 'fail',
				message: 'User with that email already exist',
			})
		}
		next(error)
	}
}

export const login = async(
	req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction) => {
		try {
			const { email, password } = req.body;
			const user = await findUserByEmail({ email });

			if (!user || !(await User.comparePasswords(password, user.password))) {
				return next(new AppError(400, 'Invalid email or password'));
			}
	
			const { access_token, refresh_token } = await signTokens(user);
	
			res.cookie('access_token', access_token, accessTokenCookieOptions);
			res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
			res.cookie('logged_in', true, {
				...accessTokenCookieOptions,
				httpOnly: false,
			});
	
			res.status(200).json({
				status: 'success',
				access_token,
			});
		} catch (error: any) {
			next(error);
		}
	}

	export const refreshAccessToken = async(
		req: Request,
		res: Response,
		next: NextFunction) => {
			try {
				const refresh_token = req.cookies.refresh_token;
		
				const message = 'Could not refresh access token';
		
				if (!refresh_token) {
					return next(new AppError(403, message));
				}
		
				const decoded = verifyJwt<{ sub: string }>(
					refresh_token,
					'refreshTokenKey'
				);
		
				if (!decoded) {
					return next(new AppError(403, message));
				}
		
				const session = await redisClient.get(decoded.sub);
		
				if (!session) {
					return next(new AppError(403, message));
				}
		
				const user = await findUserById(JSON.parse(session).id);
		
				if (!user) {
					return next(new AppError(403, message));
				}
		
				const access_token = signJwt({ sub: user.id }, 'accessTokenKey', {
					expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
				});
		
				res.cookie('access_token', access_token, accessTokenCookieOptions);
				res.cookie('logged_in', true, {
					...accessTokenCookieOptions,
					httpOnly: false,
				});
		
				res.status(200).json({
					status: 'success',
					access_token,
				});
			} catch (error: any) {
				next(error);
			}
	}

	const logoutCookies = (res: Response) => {
		res.cookie('access_token', '', { maxAge: -1 });
		res.cookie('refresh_token', '', { maxAge: -1 });
		res.cookie('logged_in', '', { maxAge: -1 });
	};

	export const logout = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const user = res.locals.user;
	
			await redisClient.del(user.id);
			logoutCookies(res);
	
			res.status(200).json({
				status: 'success',
			});
		} catch (error: any) {
			next(error);
		}
	};
	