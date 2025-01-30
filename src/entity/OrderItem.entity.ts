import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Relation} from 'typeorm'
import {OrderEntity} from "./Order.entity.js";

@Entity()
export class OrderItemEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar"})
    productId: string

    @Column({type: "varchar"})
    colorId: string

    @Column({type: "varchar", nullable: true })
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

    @ManyToOne(() => OrderEntity, (order) => order.orderItems)
    order: Relation<OrderEntity>

}