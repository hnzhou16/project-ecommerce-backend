import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation} from 'typeorm'
import {CartEntity} from "./Cart.entity.js";
import {Length} from "class-validator";
import {Exclude} from "class-transformer";

@Entity()
export class CartItemEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar"})
    productId: string

    @Column({type: "varchar"})
    colorId: string

    @Column({type: "varchar"})
    @Length(0, 100)
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
    @Exclude()
    cart: Relation<CartEntity>
}