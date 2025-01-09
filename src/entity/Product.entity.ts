import {AfterInsert, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
import {IsEnum, Length} from "class-validator";
import {ProductCategoryEntity} from "./ProductCategory.entity.js";
import {GenderEnum} from "../enums/GenderEnum.js";
import {ProductSwatchEntity} from "./ProductSwatch.entity.js";
import {ProductCarouselEntity} from "./ProductCarousel.entity.js";
import {FabricEnum} from "../enums/FabricEnum.js";
import {OccasionEnum} from "../enums/OccasionEnum.js";
import {SizeEnum} from "../enums/SizeEnum.js";

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: "varchar", unique: true, nullable: true})
  productId: string;

  @Column({type: "varchar"})
  @Length(0, 300)
  name: string

  @Column({type: "decimal", precision: 10, scale: 2})
  price: number

  @ManyToMany(() => ProductSwatchEntity, (swatch) => swatch.products,
    {cascade: true, eager: true})
  swatches: Relation<ProductSwatchEntity[]>

  @OneToMany(() => ProductCarouselEntity, (carousel) => carousel.product,
    {cascade: true, eager:true})
  mainCarousel: Relation<ProductCarouselEntity[]>

  @Column({type: 'simple-array'})
  @IsEnum(SizeEnum, {each: true})
  size: SizeEnum[]

  // SQLite doesn't support 'enum' type, store it as 'text'
  @Column({type: 'text'})
  @IsEnum(GenderEnum)
  gender: GenderEnum

  @ManyToOne(() => ProductCategoryEntity, (category) => category.products,
    {cascade: true, eager: true})
  category: Relation<ProductCategoryEntity>

  @Column({type: 'text', enum: FabricEnum})
  fabric: FabricEnum

  @Column({type: 'text', enum: OccasionEnum})
  occasion: OccasionEnum

  generateProductId(){
    this.productId = `PROD-${String(this.id).padStart(4, '0')}`
  }
}