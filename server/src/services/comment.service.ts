import { Comment } from '../entities/comment.entity'
import { AppDataSource } from '../utils/data-source'

const commentRepo = AppDataSource.getRepository(Comment)

export const createComment = async (userId: string, postId: string, text: string) => {
	await AppDataSource.manager.save(
    AppDataSource.manager.create(Comment, {userId: userId, text: text, postId: postId})
  ) as Comment;
}

export const deleteComment = async (commentId: string, userId: string) => {
	return await commentRepo.delete({
		id: commentId,
		userId
	})
}

export const getByPostId = async (postId: string) => {
	return await commentRepo.find({
		relations: { user: true },
		where: {postId},
		select: {
			id: true,
			text: true,
			user: {
				id: true,
				image: true,
				name: true,
				nickname: true,
				link: true
			}
		}
	})
}
