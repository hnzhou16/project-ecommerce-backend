import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation} from 'typeorm'
import {CartEntity} from "./Cart.entity.js";

@Entity()
export class CartItemEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar"})
    productId: string

    @Column({type: "varchar"})
    colorId: string

    @Column({type: "varchar"})
    color: string

    @Column({type: "varchar", nullable: true })
    size: string

    @Column({type: "int"})
    quantity: number

    @Column({type: "decimal", precision: 10, scale: 2})
    price: number

    @Column({type: "varchar"})
    image: string

    @Column({type: "varchar"})
    name: string

    @ManyToOne(() => CartEntity, (cart) => cart.cartItems)
    cart: Relation<CartEntity>
}