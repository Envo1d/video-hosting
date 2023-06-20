import { Column, Entity, ManyToOne } from "typeorm"
import Model from './model.entity'
import { User } from './user.entity'

@Entity('posts')
export class Post extends Model {
    @Column()
		text: string

		@Column({unique: true})
		videoUrl: string

		@ManyToOne(() => User, (user) => user.posts, {onDelete: 'CASCADE'})
		user: User

		@Column()
		userId: string
}
