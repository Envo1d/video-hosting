import { Column, Entity, ManyToOne, OneToMany } from "typeorm"
import { Comment } from './comment.entity'
import { Like } from './like.entity'
import Model from './model.entity'
import { User } from './user.entity'

@Entity('posts')
export class Post extends Model {

	@Column()
	title: string

  @Column()
	description: string

	@Column({unique: true})
	videoUrl: string

	@Column({unique: true, nullable: true})
	iconUrl: string

	@ManyToOne(() => User, (user) => user.posts, {onDelete: 'CASCADE'})
	user: User

	@Column()
	userId: string

	@OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]

	@OneToMany(() => Like, (like) => like.post)
  likes: Like[]
}
