import { useEffect } from 'react';
import { Package } from 'lucide-react';
import { useAppDispatch } from './store/hooks';
import { fetchProducts } from './store/productsSlice';
import ProductFilters from './components/ProductFilters';
import ProductTable from './components/ProductTable';
import StatsCards from './components/StatsCards';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Inventory</h1>
              <p className="text-gray-600 mt-1">Manage and track your product stock</p>
            </div>
          </div>
        </div>

        <StatsCards />
        <ProductFilters />
        <ProductTable />
      </div>
    </div>
  );
}

export default App;
