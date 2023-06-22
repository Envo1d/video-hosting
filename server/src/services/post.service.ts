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
    order: {
      created_at: 'DESC'
    }
  })
}

export const getByUserId = async(userId: string) => {
  return await postRepo.find({
    relations: ['user'],
    where: {user: {id: userId}},
    select: {
      id: true,
      text: true,
      videoUrl: true,
      user: {
        id: true,
      },
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

export const getById = async (id: string) => {
  return await postRepo.findOne({
    relations: ['user'],
    where: {id: id},
    select:{
      id: true,
      text: true,
      videoUrl: true,
      created_at: true,
      user: {
        id: true,
        name: true,
        image: true,
      },
      comments: {
        id: true,
        text: true,
        likes: true,
        childComments: {
          id: true,
          text: true,
          likes: true,
          user: {
            id: true,
            name: true,
            image: true
          }
        },
        user: {
          id: true,
          name: true,
          image: true
        }
      },
      likes: {
        id: true,
        userId: true,
        postId: true
      }
    }
  })
}

export const remove =  async (id: string) => {
  return await postRepo.delete({
    id: id
  })
}