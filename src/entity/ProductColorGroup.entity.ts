import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductSwatchEntity} from "./ProductSwatch.entity";
import {Length} from "class-validator";

@Entity()
export class ProductColorGroupEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(0, 100)
  name: string

  @Column()
  @Length(0, 300)
  url: string

  @OneToMany(() => ProductSwatchEntity, swatch => swatch.colorGroup)
  swatches: ProductSwatchEntity[]
}