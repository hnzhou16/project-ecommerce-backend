import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
import {Length} from "class-validator";
import {ProductSwatchEntity} from "./ProductSwatch.entity.js";

@Entity()
export class ProductColorGroupEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: "varchar"})
  @Length(0, 100)
  name: string

  @Column({type: "varchar"})
  @Length(0, 300)
  url: string

  @OneToMany(() => ProductSwatchEntity, swatch => swatch.colorGroup)
  swatches: Relation<ProductSwatchEntity[]>
}