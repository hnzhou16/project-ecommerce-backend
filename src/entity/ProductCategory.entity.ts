import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./Product.entity";
import {Length} from "class-validator";

@Entity()
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(0, 100)
  name: string

  @OneToMany(() => ProductEntity, (product) => product.category,
    {nullable: true, lazy: true})
  products: ProductEntity[]
}