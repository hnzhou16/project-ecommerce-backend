import {AfterInsert, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductCategoryEntity} from "./ProductCategory.entity";
import {IsEnum, Length} from "class-validator";
import {GenderEnum} from "../enums/GenderEnum";
import {ProductSwatchEntity} from "./ProductSwatch.entity";
import {ProductCarouselEntity} from "./ProductCarousel.entity";
import {FabricEnum} from "../enums/FabricEnum";
import {OccasionEnum} from "../enums/OccasionEnum";
import {SizeEnum} from "../enums/SizeEnum";

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true, nullable: true})
  productId: string;

  @Column()  @Length(0, 300)
  name: string

  @Column({type: "decimal", precision: 10, scale: 2})
  price: number

  @ManyToMany(() => ProductSwatchEntity, (swatch) => swatch.products,
    {cascade: true, eager: true})
  swatches: ProductSwatchEntity[]

  @OneToMany(() => ProductCarouselEntity, (carousel) => carousel.product,
    {cascade: true, eager:true})
  mainCarousel: ProductCarouselEntity[]

  @Column({type: 'simple-array'})
  @IsEnum(SizeEnum, {each: true})
  size: SizeEnum[]

  // SQLite doesn't support 'enum' type, store it as 'text'
  @Column({type: 'text'})
  @IsEnum(GenderEnum)
  gender: GenderEnum

  @ManyToOne(() => ProductCategoryEntity, (category) => category.products,
    {cascade: true, eager: true})
  category: ProductCategoryEntity

  @Column({type: 'text', enum: FabricEnum})
  fabric: FabricEnum

  @Column({type: 'text', enum: OccasionEnum})
  occasion: OccasionEnum

  generateProductId(){
    this.productId = `PROD-${String(this.id).padStart(4, '0')}`
  }
}