import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
import {Length} from "class-validator";
import {ProductEntity} from "./Product.entity.js";

@Entity()
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: "varchar"})
  @Length(0, 100)
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.category,
    {nullable: true, lazy: true})
  products: Relation<ProductEntity[]>
}