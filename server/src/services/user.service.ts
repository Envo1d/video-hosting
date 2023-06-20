import config from 'config'
import { User } from '../entities/user.entity'
import { CreateUserInput } from '../schemas/user.schema'
import { IUserUpdateProfile } from '../types/user.interface'
import redisClient from '../utils/connectRedis'
import { AppDataSource } from '../utils/data-source'
import { signJwt } from '../utils/jwt'

const userRepo = AppDataSource.getRepository(User)

export const createUser = async (input: CreateUserInput) => {
  return (await AppDataSource.manager.save(
    AppDataSource.manager.create(User, input)
  )) as User;
};

export const updateUserProfile = async (userId: string, data: IUserUpdateProfile) => {
  return await userRepo.update({
    id: userId
  }, {name: data.name, bio: data.bio})
}

export const updateUserImage = async (userId: string, imageUrl: string) => {
  return await userRepo.update({
    id: userId
  }, {image: imageUrl})
}

export const getRandomAmount = async (amount: number) => {
  return await userRepo.createQueryBuilder('user')
  .select()
  .orderBy('RANDOM()')
  .take(amount)
  .getMany()
}

export const findUserByEmail = async ({ email }: { email: string }) => {
  return await userRepo.findOneBy({ email });
};

export const findUserById = async (userId: string) => {
  return await userRepo.findOneBy({ id: userId });
};

export const findUser = async (query: Object) => {
  return await userRepo.findOneBy(query);
};

export const signTokens = async(user: User) => {
	// redis session
	redisClient.set(user.id, JSON.stringify(user), {
		EX: config.get<number>('redisCacheExpiresIn') * 60
	})

	const access_token = signJwt({ sub: user.id }, 'accessTokenKey', {
    expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
  });

  const refresh_token = signJwt({ sub: user.id }, 'refreshTokenKey', {
    expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
  });

  return { access_token, refresh_token };
}
