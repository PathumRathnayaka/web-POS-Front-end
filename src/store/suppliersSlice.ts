import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Supplier, Product } from '../types';
import { api } from '../api/api';

interface SuppliersState {
  suppliers: Supplier[];
  products: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: SuppliersState = {
  suppliers: [],
  products: [],
  loading: false,
  error: null,
  searchTerm: '',
};

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async () => {
    const [suppliers, products] = await Promise.all([
      api.suppliers.getAll(),
      api.products.getAll(),
    ]);
    return { suppliers, products };
  }
);

export const searchSuppliers = createAsyncThunk(
  'suppliers/search',
  async (query: string) => {
    if (!query.trim()) {
      const [suppliers, products] = await Promise.all([
        api.suppliers.getAll(),
        api.products.getAll(),
      ]);
      return { suppliers, products };
    }
    const [suppliers, products] = await Promise.all([
      api.suppliers.search(query),
      api.products.getAll(),
    ]);
    return { suppliers, products };
  }
);

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload.suppliers;
        state.products = action.payload.products;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch suppliers';
      })
      .addCase(searchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload.suppliers;
        state.products = action.payload.products;
      })
      .addCase(searchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search suppliers';
      });
  },
});

export const { setSearchTerm } = suppliersSlice.actions;
export default suppliersSlice.reducer;
