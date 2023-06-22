import { Like } from '../entities/like.entity'
import { AppDataSource } from '../utils/data-source'

const likeRepo = AppDataSource.getRepository(Like)

export const createLikeForPost = async (userId: string, postId: string) => {
	return (await AppDataSource.manager.save(
    AppDataSource.manager.create(Like, {userId: userId, postId: postId})
  )) as Like;
}

export const deleteLikeForPost = async (likeId: string) => {
	return await likeRepo.delete({
		id: likeId
	})
}

export const getLikeByIdForPost = async (likeId: string) => {
	return await likeRepo.findOne({
		where: {
			id: likeId
		},
		select: {
			id: true,
			postId: true,
			userId: true
		}
	})
}