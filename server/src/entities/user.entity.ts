import { hash, verify } from 'argon2'
import { BeforeInsert, Column, Entity, Index } from "typeorm"
import Model from './model.entity'

@Entity('users')
export class User extends Model {
    @Column()
    name: string

    @Index('email_index')
    @Column({unique: true})
    email: string

    @Column()
    password: string

    @Column({
        default: '/images/default.jpg',
      })
      photo: string;

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
