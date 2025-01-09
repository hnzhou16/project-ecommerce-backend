import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn, Relation,
} from 'typeorm'
import { CartItemEntity } from './CartItem.entity.js'
import { UserEntity } from './User.entity.js'

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
    cartItems: Relation<CartItemEntity[]>

    @OneToOne(() => UserEntity, (user) => user.cart)
    user: Relation<UserEntity>
}