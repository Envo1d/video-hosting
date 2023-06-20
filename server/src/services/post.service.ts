import { Post } from '../entities/post.entity'
import { AppDataSource } from '../utils/data-source'

const postRepo = AppDataSource.getRepository(Post)

export const createPost = async (userId: string, videoUrl: string, text: string) => {
	return (await AppDataSource.manager.save(
    AppDataSource.manager.create(Post, {videoUrl: videoUrl, text: text, userId: userId})
  )) as Post;
}

export const getById = async( userId: string) => {
  return await postRepo.find({
    relations: ['user'],
    where: {user: {id: userId}},
    select: {
      id: true,
      text: true,
      videoUrl: true,
      user: {
        id: true,
      }
    }
  })
}