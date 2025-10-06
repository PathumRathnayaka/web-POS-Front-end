import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductWithQuantity } from '../data/sampleData';
import { productsApi } from '../api/productsApi';

interface ProductsState {
  products: ProductWithQuantity[];
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    searchTerm: string;
  };
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    searchTerm: '',
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const data = await productsApi.getAllProducts();
    return data;
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
    clearFilters: (state) => {
      state.filters.category = 'all';
      state.filters.searchTerm = '';
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
      });
  },
});

export const { setCategory, setSearchTerm, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
