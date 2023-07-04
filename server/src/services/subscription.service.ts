import { In, IsNull, Not } from 'typeorm'
import { Post } from '../entities/post.entity'
import { Subscription } from '../entities/subscription.entity'
import { User } from '../entities/user.entity'
import { AppDataSource } from '../utils/data-source'

const followRepo = AppDataSource.getRepository(Subscription)
const userRepo = AppDataSource.getRepository(User)
const postRepo = AppDataSource.getRepository(Post)

export const addSubscription = async (targetId: string, userId: string) => {
	await AppDataSource.manager.save(
    AppDataSource.manager.create(Subscription, {subscriberId: userId, subscribedToId: targetId})
  ) as Subscription;
}

export const removeSubscription = async (targetId: string, userId: string) => {
  const sub = await followRepo.findOneBy({subscriberId: userId, subscribedToId: targetId})
  if(sub)
  return await followRepo.delete({
    id: sub.id
  })
  else return undefined
}

export const getFollowingPosts= async (userId: string) => {

  const res = await userRepo.find({
    relations: ['subscriptions'],
    where: {
      id: userId
    },
    select: {
      id: true,
      subscriptions : {
        subscribedToId: true
      },
    }
  })

  const ids = res[0].subscriptions.map(sub=>sub.subscribedToId)

  return await postRepo.find({
    relations: ['user', 'likes'],
    where: {
      userId: In(ids)
    },
    order: {
      created_at: 'DESC'
    },
    select: {
      id: true,
      title: true,
      videoUrl: true,
      iconUrl: true,
      description: true,
      user: {
        id: true,
        name: true,
        image: true
      },
      likes: {
        id: true,
        userId: true
      },
    }
  })
}

export const getSuggested = async (amount: number, userId: string) => {
  return await userRepo.find({
    relations: ['subscribers'],
    where: [
      {
        id: Not(userId),
        subscribers: {
         subscriberId: Not(userId)
        }
      },
      {
        id: Not(userId),
        subscribers: {
          subscriber: IsNull()
        }
      },
    ],
    order: {
      name: 'DESC'
    },
    select: {
      id: true,
      name: true,
      image: true,
      subscribers: {
        id: false,
        subscribedToId: false,
        subscriberId: false 
      }
    },
    take: amount
  })
}

export const getFollowing = async (amount: number, userId: string) => {
  return await followRepo.find({
    relations: ['subscribedTo', 'subscriber'],
    where: {
      subscriberId: userId
    },
    order: {
      subscribedTo: {
        name: 'DESC'
      }
    },
    take: amount,
    select: {
      subscribedTo: {
        id: true,
        name: true,
        image: true
      },
      subscriberId: false
    }
  })
}