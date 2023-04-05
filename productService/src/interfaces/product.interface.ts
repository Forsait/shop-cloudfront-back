export interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  count: number;
  description: string;
}

export type ProductList = Product[];
