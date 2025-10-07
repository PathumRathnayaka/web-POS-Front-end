import { ProductWithQuantity } from '../data/sampleData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://web-pos-back-end.vercel.app/api';

export const productsApi = {
  async getAllProducts(): Promise<ProductWithQuantity[]> {
    try {
      console.log('🔄 Fetching all products from:', `${API_BASE_URL}/products`);
      const response = await fetch(`${API_BASE_URL}/products`);
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('✅ Products fetched successfully:', result);
      console.log('📊 Total products:', result.data?.length || 0);
      return result.data || [];
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id: number): Promise<ProductWithQuantity | null> {
    try {
      console.log('🔄 Fetching product by ID:', id);
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Product not found:', id);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('✅ Product fetched successfully:', result);
      return result.data || null;
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      throw error;
    }
  },

  async getProductsByCategory(category: string): Promise<ProductWithQuantity[]> {
    try {
      console.log('🔄 Fetching products by category:', category);
      const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('✅ Category products fetched successfully:', result);
      console.log('📊 Products in category:', result.data?.length || 0);
      return result.data || [];
    } catch (error) {
      console.error('❌ Error fetching products by category:', error);
      throw error;
    }
  },

  async searchProducts(searchTerm: string): Promise<ProductWithQuantity[]> {
    try {
      if (!searchTerm.trim()) {
        console.log('🔄 Empty search term, fetching all products');
        return this.getAllProducts();
      }
      console.log('🔍 Searching products with term:', searchTerm);
      const response = await fetch(`${API_BASE_URL}/products/search/${encodeURIComponent(searchTerm)}`);
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('✅ Search results:', result);
      console.log('📊 Found products:', result.data?.length || 0);
      return result.data || [];
    } catch (error) {
      console.error('❌ Error searching products:', error);
      throw error;
    }
  },

  async createProduct(product: Omit<ProductWithQuantity, 'id'>): Promise<ProductWithQuantity> {
    try {
      console.log('🔄 Creating new product:', product);
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('✅ Product created successfully:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id: number, updates: Partial<ProductWithQuantity>): Promise<ProductWithQuantity | null> {
    try {
      console.log('🔄 Updating product ID:', id, 'with updates:', updates);
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Product not found for update:', id);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('✅ Product updated successfully:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: number): Promise<boolean> {
    try {
      console.log('🔄 Deleting product ID:', id);
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Product not found for deletion:', id);
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('✅ Product deleted successfully, ID:', id);
      return true;
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      throw error;
    }
  },

  async updateQuantity(productId: number, quantitySize: number): Promise<ProductWithQuantity | null> {
    try {
      console.log('🔄 Updating quantity for product ID:', productId, 'to:', quantitySize);
      const response = await fetch(`${API_BASE_URL}/quantities/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity_size: quantitySize }),
      });
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Product quantity not found for update:', productId);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('✅ Quantity updated successfully:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Error updating quantity:', error);
      throw error;
    }
  }
};