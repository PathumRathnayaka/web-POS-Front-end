import { Product, Supplier, Sale, Customer, SalesAnalytics } from '../types';

const API_BASE_URL = 'https://web-pos-back-end.vercel.app/api';

export const api = {
  products: {
    async getAll(): Promise<Product[]> {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const result = await response.json();
      return result.data || [];
    },

    async search(query: string): Promise<Product[]> {
      const response = await fetch(`${API_BASE_URL}/products/search/${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search products');
      const result = await response.json();
      return result.data || [];
    },

    async getByCategory(category: string): Promise<Product[]> {
      const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch products by category');
      const result = await response.json();
      return result.data || [];
    },
  },

  suppliers: {
    async getAll(): Promise<Supplier[]> {
      const response = await fetch(`${API_BASE_URL}/suppliers`);
      if (!response.ok) throw new Error('Failed to fetch suppliers');
      const result = await response.json();
      return result.data || [];
    },

    async search(query: string): Promise<Supplier[]> {
      const response = await fetch(`${API_BASE_URL}/suppliers/search/${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search suppliers');
      const result = await response.json();
      return result.data || [];
    },
  },

  sales: {
    async getAll(params?: { startDate?: string; endDate?: string; customerId?: number }): Promise<Sale[]> {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.customerId) queryParams.append('customerId', params.customerId.toString());

      const url = `${API_BASE_URL}/sales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch sales');
      const result = await response.json();
      return result.data || [];
    },

    async getAnalytics(): Promise<SalesAnalytics> {
      const response = await fetch(`${API_BASE_URL}/sales/analytics`);
      if (!response.ok) throw new Error('Failed to fetch sales analytics');
      const result = await response.json();
      return result.data || {
        salesTrend: [],
        topProducts: [],
        salesByCategory: [],
        revenueByPaymentMethod: [],
        monthlyRevenue: [],
      };
    },

    async getByCustomer(customerId: number): Promise<Sale[]> {
      const response = await fetch(`${API_BASE_URL}/sales/customer/${customerId}`);
      if (!response.ok) throw new Error('Failed to fetch customer sales');
      const result = await response.json();
      return result.data || [];
    },
  },

  customers: {
    async getAll(): Promise<Customer[]> {
      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const result = await response.json();
      return result.data || [];
    },

    async search(query: string): Promise<Customer[]> {
      const response = await fetch(`${API_BASE_URL}/customers/search/${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search customers');
      const result = await response.json();
      return result.data || [];
    },
  },
};
