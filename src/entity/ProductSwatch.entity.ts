import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./Product.entity";
import product from "../routes/product";
import {ProductImageEntity} from "./ProductImage.entity";
import {ProductCarouselEntity} from "./ProductCarousel.entity";
import {Length} from "class-validator";
import {ProductColorGroupEntity} from "./ProductColorGroup.entity";

@Entity()
export class ProductSwatchEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: true})
  colorId: string

  @Column()
  @Length(0, 100)
  name: string

  @Column()
  @Length(0, 300)
  url: string

  @ManyToOne(() => ProductColorGroupEntity, group => group.swatches,
    {cascade: true, eager: true})
  colorGroup: ProductColorGroupEntity

  @OneToMany(() => ProductCarouselEntity, (carousel) => carousel.swatch,
    {nullable:true, lazy: true})
  carousels: ProductCarouselEntity[]

  @ManyToMany(() => ProductEntity, (product) => product.swatches,
    {nullable: true, lazy: true})
  @JoinTable()
  products: ProductEntity[]
}