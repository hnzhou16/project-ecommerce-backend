import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import {CartEntity} from "./Cart.entity";

@Entity()
export class CartItemEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    productId: string

    @Column()
    colorId: string

    @Column()
    color: string

    @Column({ nullable: true })
    size: string

    @Column()
    quantity: number

    @Column()
    price: number

    @Column()
    image: string

    @Column()
    name: string

    @ManyToOne(() => CartEntity, (cart) => cart.cartItems)
    cart: CartEntity
}