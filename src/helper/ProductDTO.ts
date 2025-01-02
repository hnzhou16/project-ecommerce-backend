import {ProductEntity} from "../entity/Product.entity";

export class ProductDTO {
  productId: string;
  name: string;
  price: string;
  swatches: {colorId: string; name: string; url: string}[];
  mainCarousel: {colorId: string; images: string[]}[];
  size: string[];
  gender: string;
  category: string;
  fabric: string;
  occasion: string;

  constructor(product: ProductEntity) {
    this.productId = product.productId
    this.name = product.name
    this.price = parseFloat(String(product.price)).toFixed(2)
    this.swatches = product.swatches.map(s => ({
      colorId: s.colorId,
      name: s.name,
      url: s.url
    }))
    this.mainCarousel = product.mainCarousel.map(c => ({
      colorId: c.swatch.colorId,
      images: c.images.map(img => img.url)
    }))
    this.size = product.size
    this.gender = product.gender
    this.category = product.category.name
    this.fabric = product.fabric
    this.occasion = product.occasion
  }
}