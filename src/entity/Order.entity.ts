import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {OrderStatus, ShippingType} from "../enums/Enum";
import {OrderItemEntity} from "./OrderItem.entity";
import {UserEntity} from "./User.entity";

@Entity()
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('decimal', {precision: 10, scale: 2})
    taxAmount: number

    @Column('decimal', { precision: 10, scale: 2 })
    totalBeforeTax: number

    @Column('decimal', {
        precision: 10,
        scale: 2,
        default: ShippingType.STANDARD,
    })
    shippingFee: number

    @Column('decimal', { precision: 10, scale: 2 })
    total: number

    @Column({ type: 'text', default: OrderStatus.PENDING })
    orderStatus: OrderStatus // pending, paid, shipped, delivered, cancelled, etc..

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
        cascade: true,
        eager: true
    })
    orderItems: OrderItemEntity[]

    @ManyToOne(() => UserEntity, (user) => user.orders)
    user: UserEntity

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}