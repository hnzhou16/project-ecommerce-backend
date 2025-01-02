import {Request, Response} from "express";
import gDB from "../InitDataSource";
import {ProductSwatchEntity} from "../entity/ProductSwatch.entity";
import {ResMsg} from "../helper/ResMsg";
import {ProductCategoryEntity} from "../entity/ProductCategory.entity";
import {SizeEnum} from "../enums/SizeEnum";
import {GenderEnum} from "../enums/GenderEnum";
import {FabricEnum} from "../enums/FabricEnum";
import {OccasionEnum} from "../enums/OccasionEnum";
import {ProductCarouselEntity} from "../entity/ProductCarousel.entity";
import {ProductImageEntity} from "../entity/ProductImage.entity";
import {ProductEntity} from "../entity/Product.entity";
import {validate} from "class-validator";
import {CLog} from "../AppHelper";
import {ProductDTO} from "../helper/ProductDTO";
import {ProductColorGroupEntity} from "../entity/ProductColorGroup.entity";

export class ProductController {

  static async addCategory(req: Request, res: Response) {
    const CategoryRepo = gDB.getRepository(ProductCategoryEntity)

    try {
      const {categories} = req.body

      if (!Array.isArray(categories) || categories.length === 0) {
        return res.status(400).send(new ResMsg(400, 'Missing or invalid category data.'))
      }

      const newCategories = []
      for (const categoryData of categories) {
        const existingCategory = await CategoryRepo.findOne({where: {name: categoryData.name}})
        if (existingCategory) {
          console.log(`Category ${categoryData.name} already exists. Skipping.`)
          continue
        }

        const categoryEntity = new ProductCategoryEntity()
        categoryEntity.name = categoryData.name
        newCategories.push(categoryEntity)
      }

      const savedCategories = await CategoryRepo.save(newCategories)

      return res.status(200).send(new ResMsg(200, 'Categories added successfully!', savedCategories))
    } catch (err) {
      console.error('Error creating category:', err)
      return res.status(404).send(new ResMsg(404, 'Internal server error.', err))
    }
  }

  static async addSwatch(req: Request, res: Response) {
    const SwatchRepo = gDB.getRepository(ProductSwatchEntity)

    try {
      const {swatches} = req.body

      if (!Array.isArray(swatches) || swatches.length === 0) {
        return res.status(400).send(new ResMsg(400, 'Missing or invalid swatches data.'))
      }

      const newSwatches = []
      for (const swatchData of swatches) {
        const existingSwatch = await SwatchRepo.findOne({where: {name: swatchData.name}})
        if (existingSwatch) {
          console.log(`Swatch ${swatchData.name} already exists. Skipping.`)
          continue
        }

        const swatchEntity = new ProductSwatchEntity()
        swatchEntity.name = swatchData.name
        swatchEntity.url = swatchData.url
        newSwatches.push(swatchEntity)
      }

      const savedSwatches = await SwatchRepo.save(newSwatches)

      for (const swatch of savedSwatches) {
        swatch.colorId = String(swatch.id).padStart(3, '0')
        await SwatchRepo.save(swatch)
      }

      return res.status(200).send(new ResMsg(200, 'Swatches added successfully!', savedSwatches))
    } catch (err) {
      console.error('Error creating swatches:', err)
      return res.status(404).send(new ResMsg(404, 'Internal server error.', err))
    }
  }

  static async addProduct(req: Request, res: Response) {
    try {
      const {
        name, price, swatches, mainCarousel, size, gender, category, fabric, occasion
      } = req.body

      // Validate price
      if (isNaN(Number(price)) || Number(price) < 0) {
        return res.status(400).send(new ResMsg(400, 'Invalid price value.'))
      }

      const priceNumber = Number(price)

      // Validate size, gender, fabric, and occasion
      const sizeValues = []
      for (const s of size) {
        if (!Object.keys(SizeEnum).includes(s)) {
          res.status(400).send(new ResMsg(400, 'Invalid size value(s).'))
        } else {
          sizeValues.push(SizeEnum[s])
        }
      }

      if (!Object.keys(GenderEnum).includes(gender)) {
        return res.status(400).send(new ResMsg(400, 'Invalid gender.'))
      }

      if (!Object.keys(FabricEnum).includes(fabric)) {
        return res.status(400).send(new ResMsg(400, 'Invalid fabric.'))
      }

      if (!Object.keys(OccasionEnum).includes(occasion)) {
        return res.status(400).send(new ResMsg(400, 'Invalid fabric.'))
      }

      // Retrieve category
      const CategoryRepo = gDB.getRepository(ProductCategoryEntity)
      const productCategory = await CategoryRepo.findOne({where: {name: category}})
      if (!productCategory) {
        return res.status(400).send(new ResMsg(400, `Category ${category} not found.`))
      }

      // Retrieve swatches
      const SwatchRepo = gDB.getRepository(ProductSwatchEntity)
      const ColorGroupRepo = gDB.getRepository(ProductColorGroupEntity)
      const swatchEntities: ProductSwatchEntity[] = []
      for (const colorId of swatches) {
        const swatchEntity = await SwatchRepo.findOne({where: {colorId: colorId}})
        const colorGroupEntity = await ColorGroupRepo.findOne({where: {swatches: {colorId}}})

        if (!colorGroupEntity) {
          return res.status(400).send(new ResMsg(400, `Color group of ${colorId} not found.`))
        }

        swatchEntity.colorGroup = colorGroupEntity
        swatchEntities.push(swatchEntity)
      }
      if (swatchEntities.length != swatches.length) {
        return res.status(400).send(new ResMsg(400, 'One or more swatches not found.'))
      }

      // Prepare carousel entities with cascading image saving
      const CarouselRepo = gDB.getRepository(ProductCarouselEntity)
      const carouselEntities: ProductCarouselEntity[] = []
      for (const carousel of mainCarousel) {
        const {colorId, images} = carousel
        const swatch = swatchEntities.find(s => s.colorId === colorId)
        if (!swatch) {
          return res.status(400).send(new ResMsg(400, `Swatch ${colorId} not found.`))
        }

        const carouselEntity = new ProductCarouselEntity()
        carouselEntity.swatch = swatch

        const imageEntities : ProductImageEntity[] = []

        for (const imgLink of images) {
          const imageEntity = new ProductImageEntity()
          imageEntity.url = imgLink
          imageEntities.push(imageEntity)
        }

        carouselEntity.images = imageEntities
        const savedCarousel = await CarouselRepo.save(carouselEntity)
        carouselEntities.push(savedCarousel)
      }

      // Create new product
      const ProductRepo = gDB.getRepository(ProductEntity)
      const newProduct = new ProductEntity()
      newProduct.name = name
      newProduct.price = priceNumber
      newProduct.swatches = swatchEntities
      newProduct.mainCarousel = carouselEntities
      newProduct.size = sizeValues
      newProduct.gender = GenderEnum[gender]
      newProduct.category = productCategory
      newProduct.fabric = FabricEnum[fabric]
      newProduct.occasion = OccasionEnum[occasion]

      // validate product
      const productErrors = await validate(newProduct)
      if (productErrors.length > 0) {
        CLog.bad("Product validation failed: ", productErrors)
        return res.status(400).send(new ResMsg(400, 'Product not valid', productErrors))
      }
      const savedProduct = await ProductRepo.save(newProduct)

      // add productId
      savedProduct.generateProductId()
      const updatedProduct = await ProductRepo.save(savedProduct)

      return res.status(200).send(new ResMsg(200, 'Product saved.', updatedProduct))
    } catch (err) {
      CLog.bad('Error adding new product.', err)
      return res.status(404).send(new ResMsg(404, 'Internal server error.', err))
    }
  }

  static async getSingleProduct(req: Request, res: Response) {
    const productId = req.params.productId
    const colorId = req.query.colorId

    try {
      const ProductRepo = gDB.getRepository(ProductEntity)

      let product = await ProductRepo.findOne({where: {productId: productId}})

      if (!product) {
        return res.status(400).send(new ResMsg(400, 'Product not found.'))
      }

      if (colorId) {
        const selectedColor = product.swatches.find(swatch => swatch.colorId === colorId)
        if (!selectedColor) {
          return res.status(400).send(new ResMsg(400, `Product color ${colorId} not found.`))
        }
      }

      const productDTO = new ProductDTO(product)

      return res.status(200).send(new ResMsg(200, 'Fetch product successfully!', productDTO))

    } catch (err) {
      CLog.bad('Error fetch product.', err)
      return res.status(404).send(new ResMsg(404, 'Internal server error.', err))
    }
  }

  static async getAllProducts(req: Request, res: Response) {
    const ProductRepo = gDB.getRepository(ProductEntity)

    try {
      const products = await ProductRepo.find()

      if (products.length === 0) {
        return res.status(400).send(new ResMsg(400, 'No products found.'))
      }

      const productsDTO = products.map(p => new ProductDTO(p))

      return res.status(200).send(new ResMsg(200, 'Products fetched successfully', productsDTO))

    } catch (err) {
      CLog.bad('Error fetching products.', err)
      return res.status(404).send(new ResMsg(404, 'Internal server error.', err))
    }
  }

}

