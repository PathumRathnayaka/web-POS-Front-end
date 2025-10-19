import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Customer, Sale } from '../types';
import { api } from '../api/api';

interface CustomersState {
  customers: Customer[];
  sales: Sale[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: CustomersState = {
  customers: [],
  sales: [],
  loading: false,
  error: null,
  searchTerm: '',
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    const [customers, sales] = await Promise.all([
      api.customers.getAll(),
      api.sales.getAll(),
    ]);
    return { customers, sales };
  }
);

export const searchCustomers = createAsyncThunk(
  'customers/search',
  async (query: string) => {
    if (!query.trim()) {
      const [customers, sales] = await Promise.all([
        api.customers.getAll(),
        api.sales.getAll(),
      ]);
      return { customers, sales };
    }
    const [customers, sales] = await Promise.all([
      api.customers.search(query),
      api.sales.getAll(),
    ]);
    return { customers, sales };
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.sales = action.payload.sales;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch customers';
      })
      .addCase(searchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.sales = action.payload.sales;
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search customers';
      });
  },
});

export const { setSearchTerm } = customersSlice.actions;
export default customersSlice.reducer;
