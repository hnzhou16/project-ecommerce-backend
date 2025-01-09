import {Request, Response} from "express";
import {CLog} from "../AppHelper.js";
import {ResMsg} from "../helper/ResMsg.js";
import gDB from "../InitDataSource.js";
import {ProductEntity} from "../entity/Product.entity.js";
import {ProductCategoryEntity} from "../entity/ProductCategory.entity.js";
import {GenderEnum} from "../enums/GenderEnum.js";
import {FabricEnum} from "../enums/FabricEnum.js";
import {OccasionEnum} from "../enums/OccasionEnum.js";
import {SizeEnum} from "../enums/SizeEnum.js";
import {ProductDTO} from "../helper/ProductDTO.js";
import {ProductColorGroupEntity} from "../entity/ProductColorGroup.entity.js";

export class FilterController {
  static async getFilterOptions(req: Request, res: Response) {
    try {
      const categories = await gDB.getRepository(ProductCategoryEntity)
        .createQueryBuilder('category')
        .select('DISTINCT category.name', 'name')
        .getRawMany()

      const colors = await gDB.getRepository(ProductColorGroupEntity)
        .createQueryBuilder('colorGroup')
        .select(['DISTINCT colorGroup.name as colorGroup_name', 'colorGroup.url as colorGroup_url'])
        .getRawMany()

      const genders = Object.values(GenderEnum)
      const fabrics = Object.values(FabricEnum)
      const occasions = Object.values(OccasionEnum)
      const sizes = Object.values(SizeEnum)

      // mapper is actually the second half of the map function that pass the input into it
      // '...' is a copy of the returned object from the map function (NOT the function itself)
      const mapWithIsChecked = (inputs: any, mapper: any) => {
        return inputs.map((input: any) => ({
          ...mapper(input),
          isChecked: false
        }))
      }

      // a simpler version of the code below
      // Gender: genders.map(gender => ({
      //   name: gender.name,
      //   isChecked: false
      // }))
      const filterOptions = {
        Gender: mapWithIsChecked(genders, (gender: any) => ({name: gender})),
        Category: mapWithIsChecked(categories, (category: any) => ({name: category.name})),
        Size: mapWithIsChecked(sizes, (size: any) => ({name: size})),
        Color: mapWithIsChecked(colors, (color: any) => ({swatch: color})),
        Fabric: mapWithIsChecked(fabrics, (fabric: any) => ({name: fabric})),
        Occasion: mapWithIsChecked(occasions, (occasion: any) => ({name: occasion}))
      }

      return res.status(200).send(new ResMsg(200, 'Get product filters.', filterOptions))
    } catch (err) {
      CLog.bad('Error fetching filter options.', err)
      return res.status(404).send(new ResMsg(404, 'Internal server error.', err))
    }
  }

  static async getFilteredProducts(req: Request, res: Response) {
    const filterBody = req.body

    try {
      const queryBuilder =
        gDB.getRepository(ProductEntity)
        .createQueryBuilder('product')

      // need to manually load the nested entities, because 'eager' is ignored when use a queryBuilder
      // join them first, so all columns exist no matter what filters are
      queryBuilder.leftJoinAndSelect('product.swatches', 'swatches')
      queryBuilder.leftJoinAndSelect('product.mainCarousel', 'mainCarousel')
      queryBuilder.leftJoinAndSelect('mainCarousel.swatch', 'swatch')
      queryBuilder.leftJoinAndSelect('mainCarousel.images', 'images')
      // previous 'leftJoinAndSelect' is for filtering, have to write it again
      queryBuilder.leftJoinAndSelect('product.category', 'category')

      const genderFilters = filterBody.Gender
        ?.filter((item: any) => item.isChecked)
        .map((item: any) => item.name)

      if (genderFilters?.length > 0) {
        queryBuilder.andWhere('product.gender IN (:...genderFilters)', {genderFilters})
      }

      const categoryFilters = filterBody.Category
        ?.filter((item: any) => item.isChecked)
        .map((item: any) => item.name)

      if (categoryFilters?.length > 0) {
        // 'category' is relation NOT direct column, need to join first, then use the alias to call 'name'
        // 'category.name' here, NOT 'product.category.name'
        queryBuilder.andWhere('category.name IN (:...categoryFilters)', {categoryFilters})
      }

      // size is an array
      const sizeFilters = filterBody.Size
        ?.filter((item: any) => item.isChecked)
        .map((item: any) => item.name)

      if (sizeFilters?.length > 0) {
        const sizeConditions = sizeFilters.map(size => `product.size LIKE :${size}`).join(' OR ')
        sizeFilters.forEach(size => {
          queryBuilder.setParameter(size, `%${size}%`)
        })
        queryBuilder.andWhere(`(${sizeConditions})`);
      }

      const colorFilters = filterBody.Color
        ?.filter((item: any) => item.isChecked)
        .map((item: any) => item.swatch?.colorGroup_name)

      if (colorFilters?.length > 0) {
        queryBuilder.leftJoinAndSelect('swatches.colorGroup', 'colorGroup')
        queryBuilder.andWhere('colorGroup.name IN (:...colorFilters)', {colorFilters})
      }

      const fabricFilters = filterBody.Fabric
        ?.filter((item: any) => item.isChecked)
        .map((item: any) => item.name)

      if (fabricFilters?.length > 0) {
        queryBuilder.andWhere('product.fabric IN (:...fabricFilters)', {fabricFilters})
      }

      const occasionFilters = filterBody.Occasion
        ?.filter((item: any) => item.isChecked)
        .map((item: any) => item.name)

      if (occasionFilters?.length > 0) {
        queryBuilder.andWhere('product.occasion IN (:...occasionFilters)', {occasionFilters})
      }



      const products = await queryBuilder.getMany()
      // console.log(products)

      const productsDTO = products.map(p => new ProductDTO(p))

      return res.status(200).send(new ResMsg(200, 'Filtered products.', productsDTO))

    } catch (err) {
      CLog.bad('Error fetching filtered products.', err)
      return res.status(404).send(new ResMsg(404, 'Internal server error.', err))
    }
  }
}