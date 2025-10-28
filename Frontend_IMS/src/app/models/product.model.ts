// src/app/models/product.model.ts

export interface ProductDTO {
  productId: number;
  productName: string;
  description: string;
  price: number;
  quantityInStock: number;
  minStock: number;
  lowStock: boolean;
  categoryName: string;
  supplierName: string;
}
