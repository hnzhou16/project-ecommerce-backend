import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, Relation} from 'typeorm'
import {IsEmail, IsOptional, Length, Matches, Max, Min} from 'class-validator'
import bcrypt from 'bcrypt'
import crypto from "crypto";
import {CartEntity} from "./Cart.entity.js";
import {OrderEntity} from "./Order.entity.js";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: "varchar", nullable: true})
  @Length(0, 300)
  firstName: string

  @Column({type: "varchar", nullable: true})
  @Length(0, 300)
  lastName: string

  @Column({type: "varchar",  nullable: false, unique: true })
  @IsEmail({}, {groups: ['email']})
  @Length(5, 500, {groups: ['email']})
  email: string

  @Column({type: "varchar",  nullable: true})
  @Length(5, 500)
  contactEmail: string

  @Column({type: "varchar", nullable: true})
  @Length(0, 500)
  streetAddress: string

  @Column({type: "varchar", nullable: true})
  @Length(0, 100)
  city: string

  @Column({type: "varchar", nullable: true})
  @Length(0, 100)
  stateUSA: string

  @Column({type: "varchar", nullable: true})
  @Length(0, 100)
  zipcode: string

  @Column({type: "varchar", nullable: true})
  @Length(0, 100)
  country: string

  @Column({type: "varchar"})
  @Length(8, 100, {groups: ['password']})
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number',
    groups: ['password']
  })
  password: string

  @Column({type: "varchar", nullable: true})
  resetToken: string

  @Column({type: "varchar", nullable: true})
  resetTokenExpiry: number

  @OneToOne(() => CartEntity, (cart) => cart.user, {eager: true, cascade: ['insert']})
  @JoinColumn() // JoinColumn decides which side will have a column to show the foreign key (the other entity id)
  cart: Relation<CartEntity>

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: Relation<OrderEntity[]>

  // constructor() {
  //   // @OneToOne defines a link, but it does not automatically create an instance of CartEntity
  //   // When TypeORM instantiates a UserEntity, all fields including relationships, default to null unless explicitly set
  //   if (!this.cart) {
  //     this.cart = new CartEntity()
  //   }
  // }

  hashPassword() {
    const salt = 10
    this.password = bcrypt.hashSync(this.password, salt)
  }

  async validatePlainPassword(plainText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, this.password)
  }

  generateResetToken() {
    const tokenExpiry = Date.now() + 60 * 60 * 1000
    this.resetToken = crypto.randomBytes(20).toString('hex')
    this.resetTokenExpiry = tokenExpiry
  }
}
