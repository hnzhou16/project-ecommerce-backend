import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
import {Length} from "class-validator";
import {ProductCarouselEntity} from "./ProductCarousel.entity.js";

@Entity()
export class ProductImageEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: "varchar", unique: true})
  @Length(0, 300)
  url: string

  @ManyToOne(() => ProductCarouselEntity, (carousel) => carousel.images)
  carousel: Relation<ProductCarouselEntity>
}