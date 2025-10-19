import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import dashboardReducer from './dashboardSlice';
import suppliersReducer from './suppliersSlice';
import salesReducer from './salesSlice';
import customersReducer from './customersSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    dashboard: dashboardReducer,
    suppliers: suppliersReducer,
    sales: salesReducer,
    customers: customersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
