export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  notes?: string;
  companyInfo: CompanyInfo;
}

export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logo?: string; // Optional logo URL
  bankInfo?: string; // Optional bank account information
}

export interface InvoiceFormData {
  customer: Customer;
  items: Omit<InvoiceItem, 'id' | 'total'>[];
  dueDate: string;
  taxRate: number;
  notes?: string;
  companyInfo: CompanyInfo;
}