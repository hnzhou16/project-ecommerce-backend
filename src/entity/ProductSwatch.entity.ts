import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
import {Length} from "class-validator";
import {ProductEntity} from "./Product.entity.js";
import {ProductCarouselEntity} from "./ProductCarousel.entity.js";
import {ProductColorGroupEntity} from "./ProductColorGroup.entity.js";

@Entity()
export class ProductSwatchEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: "varchar", nullable: true})
  colorId: string

  @Column({type: "varchar"})
  @Length(0, 100)
  name: string

  @Column({type: "varchar"})
  @Length(0, 300)
  url: string

  @ManyToOne(() => ProductColorGroupEntity, group => group.swatches,
    {cascade: true, eager: true})
  colorGroup: Relation<ProductColorGroupEntity>

  @OneToMany(() => ProductCarouselEntity, (carousel) => carousel.swatch,
    {nullable:true, lazy: true})
  carousels: Relation<ProductCarouselEntity[]>

  @ManyToMany(() => ProductEntity, (product) => product.swatches,
    {nullable: true, lazy: true})
  @JoinTable()
  products: Relation<ProductEntity[]>
}