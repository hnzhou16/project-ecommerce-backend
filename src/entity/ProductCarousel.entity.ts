import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import exp = require("node:constants");
import {ProductImageEntity} from "./ProductImage.entity";
import {ProductSwatchEntity} from "./ProductSwatch.entity";
import Product from "../routes/product";
import {ProductEntity} from "./Product.entity";

@Entity()
export class ProductCarouselEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ProductSwatchEntity, (swatch) => swatch.carousels,
    {eager: true})
  swatch: ProductSwatchEntity

  @OneToMany(() => ProductImageEntity, (image) => image.carousel,
    {nullable: true, cascade: true, eager: true})
  images: ProductImageEntity[]

  @ManyToOne(() => ProductEntity, (product) => product.mainCarousel,
    {nullable: true, lazy: true})
  product: ProductEntity
}