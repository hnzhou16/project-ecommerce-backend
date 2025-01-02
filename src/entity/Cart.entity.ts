import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { CartItemEntity } from './CartItem.entity'
import { UserEntity } from './User.entity'

@Entity()
export class CartEntity {
    @PrimaryGeneratedColumn()
    id: number

    // this column won't show, because in OneToMany relationship, foreign key only show in the 'Many' entity side

    // eager: when fetching cart, it'll automatically fetch 'cartItem' too
    // cascade: when parent(Cart) have actions such as insert/update/delete
    // it will carry on to the children(CartItem)
    @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, {
        cascade: true, // only need to save CartEntity, it'll automatically save CartItems
        eager: true,
    })
    cartItems: CartItemEntity[]

    @OneToOne(() => UserEntity, (user) => user.cart)
    user: UserEntity
}