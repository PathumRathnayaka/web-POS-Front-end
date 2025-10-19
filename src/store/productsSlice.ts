import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';
import { api } from '../api/api';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    searchTerm: string;
    stockLevel: string;
  };
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    searchTerm: '',
    stockLevel: 'all',
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    return await api.products.getAll();
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string) => {
    if (!query.trim()) {
      return await api.products.getAll();
    }
    return await api.products.search(query);
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
    },
    setStockLevel: (state, action: PayloadAction<string>) => {
      state.filters.stockLevel = action.payload;
    },
    clearFilters: (state) => {
      state.filters.category = 'all';
      state.filters.searchTerm = '';
      state.filters.stockLevel = 'all';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search products';
      });
  },
});

export const { setCategory, setSearchTerm, setStockLevel, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
