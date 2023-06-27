import { Post } from '../entities/post.entity'
import { AppDataSource } from '../utils/data-source'

const postRepo = AppDataSource.getRepository(Post)

export const createPost = async (userId: string, videoUrl: string, text: string) => {
	return (await AppDataSource.manager.save(
    AppDataSource.manager.create(Post, {videoUrl: videoUrl, text: text, userId: userId})
  )) as Post;
}

export const getAll = async () => {
  return await postRepo.find({
    relations: ['user', 'likes'],
    order: {
      created_at: 'DESC'
    },
    select: {
      id: true,
      text: true,
      videoUrl: true,
      user: {
        id: true,
        name: true,
        image: true
      },
      likes: {
        id: true,
        userId: true
      },
      reposts: true
    }
  })
}

export const getPostIdsByUserId = async(userId: string)=> {
  return await postRepo.find({
    where: {user: {id: userId}},
    select: {
      id: true,
    }
  })
}

export const getByUserId = async(userId: string) => {
  return await postRepo.find({
    relations: ['user', 'likes'],
    where: {user: {id: userId}},
    select: {
      id: true,
      text: true,
      videoUrl: true,
      user: {
        id: true,
      },
      likes: {
        id: true,
        userId: true,
      },
      reposts: true
    },
    order: {
      created_at: 'DESC'
    }
  })
}

export const getByIdAndUserId = async (id: string, userId: string) => {
  return await postRepo.findOne({
    relations: ['user'],
    where: {id: id, user: {id: userId}},
    select: {
      id: true,
      videoUrl: true
    }
  })
}

export const updateRepostsCounter = async (id: string) => {
  return await AppDataSource.createQueryBuilder()
  .update(Post)
  .where({ id: id })
  .set({reposts: ()=> "reposts + 1"})
  .execute()
}

export const getById = async (id: string) => {
  return await postRepo.findOne({
    relations: ['user', 'likes'],
    where: {id: id},
    select: {
      id: true,
      text: true,
      videoUrl: true,
      created_at: true,
      user: {
        id: true,
        name: true,
        image: true
      },
      likes: {
        id: true,
        userId: true,
      },
      reposts: true
    },
  })
}

export const remove =  async (id: string) => {
  return await postRepo.delete({
    id: id
  })
}