import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductCarouselEntity} from "./ProductCarousel.entity";
import {Length} from "class-validator";

@Entity()
export class ProductImageEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true})
  @Length(0, 300)
  url: string

  @ManyToOne(() => ProductCarouselEntity, (carousel) => carousel.images)
  carousel: ProductCarouselEntity
}