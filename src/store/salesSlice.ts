import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Sale } from '../types';
import { api } from '../api/api';

interface SalesState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  filters: {
    searchTerm: string;
    startDate: string;
    endDate: string;
    paymentMethod: string;
  };
}

const initialState: SalesState = {
  sales: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    startDate: '',
    endDate: '',
    paymentMethod: 'all',
  },
};

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (params?: { startDate?: string; endDate?: string; customerId?: number }) => {
    return await api.sales.getAll(params);
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.filters.startDate = action.payload.startDate;
      state.filters.endDate = action.payload.endDate;
    },
    setPaymentMethod: (state, action: PayloadAction<string>) => {
      state.filters.paymentMethod = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        searchTerm: '',
        startDate: '',
        endDate: '',
        paymentMethod: 'all',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sales';
      });
  },
});

export const { setSearchTerm, setDateRange, setPaymentMethod, clearFilters } = salesSlice.actions;
export default salesSlice.reducer;
