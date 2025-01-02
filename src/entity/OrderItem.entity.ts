import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm'
import {OrderEntity} from "./Order.entity";
import {UserEntity} from "./User.entity";

@Entity()
export class OrderItemEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    productId: string

    @Column()
    colorId: string

    @Column({ nullable: true })
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

    @ManyToOne(() => OrderEntity, (order) => order.orderItems)
    order: OrderEntity

}