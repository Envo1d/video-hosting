import { hash, verify } from 'argon2'
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm"
import Model from './model.entity'
import { Post } from './post.entity'

@Entity('users')
export class User extends Model {
    @Column()
    name: string

    @Index('email_index')
    @Column({unique: true})
    email: string

    @Column({default: ''})
    bio: string

    @Column()
    password: string

    @Column({ default: '/default.jpg',})
    image: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

    toJSON() {
      return { ...this, password: undefined};
    }

    @BeforeInsert()
    async hashPassword() {
      this.password = await hash(this.password)
    }

    static async comparePasswords(
      password: string,
      hashedPassword: string
    ) {
      return await verify(hashedPassword, password);
    }
}
