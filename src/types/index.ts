export interface Product {
  id: number;
  name: string;
  barcode: string;
  category: string;
  sale_price: string;
  discount: string;
  tax: string;
  supplier_id: number | null;
  supplier_name: string;
  expire_date: string | null;
  created_date: string;
  quantities: {
    id: string;
    product_id: number;
    quantity_size: number;
    created_date: string;
    updated_date: string;
  } | null;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
}

export interface Sale {
  id: number;
  sale_id: string;
  customer_id: number | null;
  customer_contact: string;
  sale_date: string;
  sub_total: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  change_amount: number;
  payment_method: string;
  sale_items: SaleItem[];
}

export interface SaleItem {
  id: number;
  sale_id: string;
  product_id: number;
  product_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  sub_total: number;
}

export interface Customer {
  id: number;
  contact: string;
  email: string;
  created_date: string;
  total_purchases?: number;
  last_purchase_date?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  revenue: number;
  lowStockItems: number;
  activeSuppliers: number;
}

export interface SalesAnalytics {
  salesTrend: { date: string; sales: number; revenue: number }[];
  topProducts: { name: string; sales: number }[];
  salesByCategory: { category: string; value: number }[];
  revenueByPaymentMethod: { method: string; revenue: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}
