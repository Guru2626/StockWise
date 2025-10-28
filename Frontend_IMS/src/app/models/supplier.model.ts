export interface SupplierDTO {
  supplierId: number;       // Matches Long supplierId in backend
  supplierName: string;     // Supplier name
  email: string;            // Supplier email
  phone: string;            // Supplier phone number
  address: string;          // Supplier address
  city: string;             // Supplier city
}