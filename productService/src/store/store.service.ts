import { Product } from "../interfaces/product.interface";
import { PRODUCTS } from "./products-list";

export class StoreService {
  static getAllProductsList(): Product[] {
    return PRODUCTS;
  }
}
