import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardStats, SalesAnalytics, Sale } from '../types';
import { api } from '../api/api';

interface DashboardState {
  stats: DashboardStats;
  analytics: SalesAnalytics;
  recentSales: Sale[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalProducts: 0,
    totalSales: 0,
    revenue: 0,
    lowStockItems: 0,
    activeSuppliers: 0,
  },
  analytics: {
    salesTrend: [],
    topProducts: [],
    salesByCategory: [],
    revenueByPaymentMethod: [],
    monthlyRevenue: [],
  },
  recentSales: [],
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    const [products, sales, analytics, suppliers] = await Promise.all([
      api.products.getAll(),
      api.sales.getAll(),
      api.sales.getAnalytics(),
      api.suppliers.getAll(),
    ]);

    const lowStockItems = products.filter(p => {
      const qty = p.quantities?.quantity_size || 0;
      return qty > 0 && qty < 30;
    }).length;

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);

    const recentSales = sales
      .sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())
      .slice(0, 10);

    return {
      stats: {
        totalProducts: products.length,
        totalSales: sales.length,
        revenue: totalRevenue,
        lowStockItems,
        activeSuppliers: suppliers.length,
      },
      analytics,
      recentSales,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.analytics = action.payload.analytics;
        state.recentSales = action.payload.recentSales;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export default dashboardSlice.reducer;
