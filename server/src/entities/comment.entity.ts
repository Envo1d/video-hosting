import { Column, Entity, ManyToOne, OneToMany } from "typeorm"
import { CommentLike } from './comment-like.entity'
import Model from './model.entity'
import { Post } from './post.entity'
import { User } from './user.entity'

@Entity('comments')
export class Comment extends Model {
    @Column()
		text: string

		@ManyToOne(() => User, (user) => user.comments, {onDelete: 'CASCADE'})
		user: User

		@Column()
		userId: string

		@ManyToOne(() => Post, (post) => post.comments, {onDelete: 'CASCADE'})
		post: Post

		@Column()
		postId: string

		@OneToMany(() => CommentLike, (like) => like.comment)
    likes: CommentLike[]

		@ManyToOne(() => Comment, (comment) => comment.childComments)
    parentComment: Comment

    @OneToMany(() => Comment, (comment) => comment.parentComment)
    childComments: Comment[]
}
