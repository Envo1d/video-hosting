import { Comment } from '../entities/comment.entity'
import { AppDataSource } from '../utils/data-source'

const commentRepo = AppDataSource.getRepository(Comment)

export const createComment = async (userId: string, postId: string, text: string) => {
	return (await AppDataSource.manager.save(
    AppDataSource.manager.create(Comment, {userId: userId, text: text, postId: postId})
  )) as Comment;
}

export const deleteComment = async (commentId: string) => {
	return await commentRepo.delete({
		id: commentId
	})
}