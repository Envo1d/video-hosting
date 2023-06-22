import { Column, Entity, ManyToOne } from "typeorm"
import { Comment } from './comment.entity'
import Model from './model.entity'
import { Post } from './post.entity'
import { User } from './user.entity'

@Entity('likes')
export class Like extends Model {
		@ManyToOne(() => User, (user) => user.likes, {onDelete: 'CASCADE'})
		user: User

		@Column()
		userId: string

		@ManyToOne(() => Post, (post) => post.likes, {onDelete: 'CASCADE'})
		post: Post

		@Column()
		postId: string

		@ManyToOne(() => Comment, (comment) => comment.likes, {onDelete: 'CASCADE'})
		comment: Comment

		@Column()
		commentId: string
}
