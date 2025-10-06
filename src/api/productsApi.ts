import { ProductWithQuantity } from '../data/sampleData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://web-pos-back-end.vercel.app/api';

export const productsApi = {
  async getAllProducts(): Promise<ProductWithQuantity[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id: number): Promise<ProductWithQuantity | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async getProductsByCategory(category: string): Promise<ProductWithQuantity[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  async searchProducts(searchTerm: string): Promise<ProductWithQuantity[]> {
    try {
      if (!searchTerm.trim()) {
        return this.getAllProducts();
      }
      const response = await fetch(`${API_BASE_URL}/products/search/${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  async createProduct(product: Omit<ProductWithQuantity, 'id'>): Promise<ProductWithQuantity> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id: number, updates: Partial<ProductWithQuantity>): Promise<ProductWithQuantity | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        if (response.status === 404) return false;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async updateQuantity(productId: number, quantitySize: number): Promise<ProductWithQuantity | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/quantities/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity_size: quantitySize }),
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }
};