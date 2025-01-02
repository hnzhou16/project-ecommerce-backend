import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany} from 'typeorm'
import {IsEmail, IsOptional, Length, Matches, Max, Min} from 'class-validator'
import * as bcrypt from 'bcrypt'
import {CartEntity} from "./Cart.entity";
import * as trace_events from "trace_events";
import * as crypto from "crypto";
import Order from "../routes/order";
import {OrderEntity} from "./Order.entity";
import order from "../routes/order";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: true})
  @Length(0, 300)
  firstName: string

  @Column({nullable: true})
  @Length(0, 300)
  lastName: string

  @Column({ nullable: false, unique: true })
  @IsEmail({}, {groups: ['email']})
  @Length(5, 500, {groups: ['email']})
  email: string

  @Column()
  @Length(8, 100, {groups: ['password']})
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number',
    groups: ['password']
  })
  password: string

  @Column({nullable: true})
  resetToken: string

  @Column({nullable: true})
  resetTokenExpiry: number

  @OneToOne(() => CartEntity, (cart) => cart.user, {cascade: true})
  @JoinColumn() // JoinColumn decides which side will have a column to show the foreign key (the other entity id)
  cart: CartEntity

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[]

  constructor() {
    // @OneToOne defines a link, but it does not automatically create an instance of CartEntity
    // When TypeORM instantiates a UserEntity, all fields including relationships, default to null unless explicitly set
    if (!this.cart) {
      this.cart = new CartEntity()
    }
  }

  hashPassword() {
    const salt = 10
    this.password = bcrypt.hashSync(this.password, salt)
  }

  validatePlainPassword(plainText: string): boolean {
    return bcrypt.compare(plainText, this.password)
  }

  generateResetToken() {
    const tokenExpiry = Date.now() + 60 * 60 * 1000
    this.resetToken = crypto.randomBytes(20).toString('hex')
    this.resetTokenExpiry = tokenExpiry
  }
}
