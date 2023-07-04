import { hash, verify } from 'argon2'
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm"
import { CommentLike } from './comment-like.entity'
import { Comment } from './comment.entity'
import { Like } from './like.entity'
import Model from './model.entity'
import { Post } from './post.entity'
import { Subscription } from './subscription.entity'

@Entity('users')
export class User extends Model {
    @Column()
    name: string

    @Column({unique: true})
    nickname: string

    @Index('link_index')
    @Column({unique: true})
    link: string

    @Index('email_index')
    @Column({unique: true})
    email: string

    @Column({default: ''})
    bio: string

    @Column()
    password: string

    @Column({ default: '/default.jpg',})
    image: string;

    @Column({default: ''})
    profileBackgroundImage: string

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[]

    @OneToMany(() => CommentLike, (like) => like.user)
    commentLikes: CommentLike[]

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[]

    @OneToMany(() => Subscription, subscription => subscription.subscriber)
    subscriptions: Subscription[];
  
    @OneToMany(() => Subscription, subscription => subscription.subscribedTo)
    subscribers: Subscription[];

    toJSON() {
      return { ...this, password: undefined};
    }

    @BeforeInsert()
    async hashPassword() {
      this.password = await hash(this.password)
    }

    @BeforeInsert()
    createLink() {
      this.link = `@${this.nickname}`
    }

    static async comparePasswords(
      password: string,
      hashedPassword: string
    ) {
      return await verify(hashedPassword, password);
    }
}
