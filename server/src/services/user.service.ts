import config from 'config'
import { User } from '../entities/user.entity'
import { CreateUserInput } from '../schemas/user.schema'
import redisClient from '../utils/connectRedis'
import { AppDataSource } from '../utils/data-source'
import { signJwt } from '../utils/jwt'

const userRepo = AppDataSource.getRepository(User)

export const createUser = async (input: CreateUserInput) => {
  return (await AppDataSource.manager.save(
    AppDataSource.manager.create(User, input)
  )) as User;
};

export const findUserByEmail = async ({ email }: { email: string }) => {
  return await userRepo.findOneBy({ email });
};

export const findUserById = async (userId: string) => {
  return await userRepo.findOneBy({ id: userId });
};

export const findUser = async (query: Object) => {
  return await userRepo.findOneBy(query);
};

export const signTokens =async(user: User) => {
	// redis session
	redisClient.set(user.id, JSON.stringify(user), {
		EX: config.get<number>('redisCacheExpiresIn') * 60
	})

	const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
    expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
  });

  const refresh_token = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
    expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
  });

  return { access_token, refresh_token };
}
