import { Column, Entity, ManyToOne, OneToMany } from "typeorm"
import { Like } from './like.entity'
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

		@OneToMany(() => Like, (like) => like.user)
    likes: Like[]

		@ManyToOne((type) => Comment, (comment) => comment.childComments)
    parentComment: Comment

    @OneToMany((type) => Comment, (comment) => comment.parentComment)
    childComments: Comment[]
}