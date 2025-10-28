
export interface ProductRequestDTO {
  productName: string;
  description: string;
  price: number;
  quantityInStock: number;
  minStock?: number;  // optional like in backend comment
  categoryId: number;
  supplierId: number;
}
