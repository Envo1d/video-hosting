import { Column, Entity, ManyToOne } from "typeorm"
import { Comment } from './comment.entity'
import Model from './model.entity'
import { User } from './user.entity'

@Entity('comment_likes')
export class CommentLike extends Model {
		@ManyToOne(() => User, (user) => user.commentLikes, {onDelete: 'CASCADE'})
		user: User

		@Column()
		userId: string

		@ManyToOne(() => Comment, (comment) => comment.likes, {onDelete: 'CASCADE'})
		comment: Comment

		@Column()
		commentId: string
}
