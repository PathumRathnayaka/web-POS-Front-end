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
    try {
      console.log('Fetching dashboard data...');
      const [products, sales, suppliers] = await Promise.all([
        api.products.getAll(),
        api.sales.getAll(),
        api.suppliers.getAll(),
      ]);

      console.log('Data fetched:', {
        productsCount: products?.length || 0,
        salesCount: sales?.length || 0,
        suppliersCount: suppliers?.length || 0,
        sampleSale: sales?.[0]
      });

      // Ensure we have arrays
      const safeProducts = Array.isArray(products) ? products : [];
      const safeSales = Array.isArray(sales) ? sales : [];
      const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];

      // Calculate low stock items
      const lowStockItems = safeProducts.filter(p => {
        const qty = p.quantities?.quantity_size || 0;
        return qty > 0 && qty < 30;
      }).length;

      // Calculate total revenue
      const totalRevenue = safeSales.reduce((sum, sale) => {
        const amount = sale.total_amount || 0;
        return sum + amount;
      }, 0);

      // Get recent sales (last 10)
      const recentSales = [...safeSales]
        .filter(sale => {
          if (!sale.sale_date) return false;
          try {
            const date = new Date(sale.sale_date);
            return !isNaN(date.getTime());
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          try {
            return new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime();
          } catch {
            return 0;
          }
        })
        .slice(0, 10);

      // Generate sales trend data (last 7 days)
      const salesTrend = generateSalesTrend(safeSales);

      // Get top 5 products
      const topProducts = getTopProducts(safeSales);

      // Get sales by category
      const salesByCategory = getSalesByCategory(safeSales);

      // Get revenue by payment method
      const revenueByPaymentMethod = getRevenueByPaymentMethod(safeSales);

      // Generate monthly revenue (last 6 months)
      const monthlyRevenue = generateMonthlyRevenue(safeSales);

      const result = {
        stats: {
          totalProducts: safeProducts.length,
          totalSales: safeSales.length,
          revenue: totalRevenue,
          lowStockItems,
          activeSuppliers: safeSuppliers.length,
        },
        analytics: {
          salesTrend,
          topProducts,
          salesByCategory,
          revenueByPaymentMethod,
          monthlyRevenue,
        },
        recentSales,
      };

      console.log('Dashboard data processed successfully:', result);
      return result;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
);

// Helper function to generate sales trend
function generateSalesTrend(sales: Sale[]) {
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const daySales = sales.filter(sale => {
      if (!sale.sale_date) return false;
      try {
        const saleDate = new Date(sale.sale_date);
        if (isNaN(saleDate.getTime())) return false;
        const saleDateStr = saleDate.toISOString().split('T')[0];
        return saleDateStr === dateStr;
      } catch {
        return false;
      }
    });
    
    const dayRevenue = daySales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    
    last7Days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: daySales.length,
      revenue: dayRevenue,
    });
  }
  
  return last7Days;
}

// Helper function to get top products
function getTopProducts(sales: Sale[]) {
  const productSales: { [key: string]: number } = {};
  
  sales.forEach(sale => {
    if (sale.sale_items && Array.isArray(sale.sale_items)) {
      sale.sale_items.forEach(item => {
        const name = item.product_name || 'Unknown';
        productSales[name] = (productSales[name] || 0) + (item.quantity || 0);
      });
    }
  });
  
  return Object.entries(productSales)
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
}

// Helper function to get sales by category
function getSalesByCategory(sales: Sale[]) {
  const categorySales: { [key: string]: number } = {};
  
  sales.forEach(sale => {
    if (sale.sale_items && Array.isArray(sale.sale_items)) {
      sale.sale_items.forEach(item => {
        const category = item.category || 'Uncategorized';
        categorySales[category] = (categorySales[category] || 0) + (item.quantity || 0);
      });
    }
  });
  
  return Object.entries(categorySales)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);
}

// Helper function to get revenue by payment method
function getRevenueByPaymentMethod(sales: Sale[]) {
  const methodRevenue: { [key: string]: number } = {};
  
  sales.forEach(sale => {
    const method = sale.payment_method || 'Unknown';
    methodRevenue[method] = (methodRevenue[method] || 0) + (sale.total_amount || 0);
  });
  
  return Object.entries(methodRevenue)
    .map(([method, revenue]) => ({ method, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}

// Helper function to generate monthly revenue
function generateMonthlyRevenue(sales: Sale[]) {
  const monthlyData: { [key: string]: number } = {};
  const today = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    monthlyData[monthKey] = 0;
  }
  
  sales.forEach(sale => {
    if (!sale.sale_date) return;
    try {
      const saleDate = new Date(sale.sale_date);
      if (isNaN(saleDate.getTime())) return;
      const monthKey = saleDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthKey in monthlyData) {
        monthlyData[monthKey] += sale.total_amount || 0;
      }
    } catch {
      // Skip invalid dates
    }
  });
  
  return Object.entries(monthlyData)
    .map(([month, revenue]) => ({ month, revenue }));
}

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
        // Keep initial state values on error
        state.stats = initialState.stats;
        state.analytics = initialState.analytics;
        state.recentSales = initialState.recentSales;
      });
  },
});

export default dashboardSlice.reducer;