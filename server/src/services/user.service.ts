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

export const updateUserBackImage = async (userId: string, imageUrl: string) => {
  return await userRepo.update({
    id: userId
  }, {profileBackgroundImage: imageUrl})
}

export const findUserByEmail = async ({ email }: { email: string }) => {
  return await userRepo.findOneBy({ email });
};

export const findUserById = async (userId: string) => {
  return await userRepo.findOneBy({ id: userId });
};

export const getUserImageById = async (userId: string) => {
  return await userRepo.findOneBy({id:userId}).then(user => user?.image || undefined)
}

export const getUserBackImageById = async (userId: string) => {
  return await userRepo.findOneBy({id:userId}).then(user => user?.profileBackgroundImage || undefined)
}

export const getFullUser = async (userId:string) =>{
  return await userRepo.find({
    relations: ['posts', 'subscriptions', 'subscribers'],
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      bio: true,
      image: true,
      profileBackgroundImage: true,
      posts: {
        likes: {
          id: true
        }
      },
      subscriptions : {
        subscribedToId: true
      },
      subscribers: {
        subscriberId: true
      }
    }
  })
}

export const findUser = async (query: Object) => {
  return await userRepo.findOneBy(query);
};

export const signTokens = async(user: User) => {
	// redis session
	redisClient.set(user.id, JSON.stringify(user), {
		EX: config.get<number>('redisCacheExpiresIn') * 60 * 24 * 30
	})

	const access_token = signJwt({ sub: user.id }, 'accessTokenKey', {
    expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
  });

  const refresh_token = signJwt({ sub: user.id }, 'refreshTokenKey', {
    expiresIn: `${config.get<number>('refreshTokenExpiresIn')}d`,
  });

  return { access_token, refresh_token };
}
