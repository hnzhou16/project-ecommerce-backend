import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
import {ProductImageEntity} from "./ProductImage.entity.js";
import {ProductSwatchEntity} from "./ProductSwatch.entity.js";
import {ProductEntity} from "./Product.entity.js";

@Entity()
export class ProductCarouselEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ProductSwatchEntity, (swatch) => swatch.carousels,
    {eager: true})
  swatch: Relation<ProductSwatchEntity>

  @OneToMany(() => ProductImageEntity, (image) => image.carousel,
    {nullable: true, cascade: true, eager: true})
  images: Relation<ProductImageEntity[]>

  @ManyToOne(() => ProductEntity, (product) => product.mainCarousel,
    {nullable: true, lazy: true})
  product: Relation<ProductEntity>
}