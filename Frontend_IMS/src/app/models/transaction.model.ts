export interface TransactionDTO {
  transactionId: number;
  transactionType: string;
  productName: string;
  supplierName: string;
  userName: string;
  quantity: number;
  price: number;
  transactionDate: string; // use string for LocalDateTime
}
