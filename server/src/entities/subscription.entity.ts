import { Column, Entity, ManyToOne } from 'typeorm'
import Model from './model.entity'
import { User } from './user.entity'

@Entity({name: 'subscriptions'})
export class Subscription extends Model {
	@ManyToOne(type => User, user => user.subscriptions)
  subscriber?: User | null;

  @Column()
  subscriberId: string

  @ManyToOne(type => User, user => user.subscribers)
  subscribedTo?: User | null;

  @Column()
  subscribedToId: string
}