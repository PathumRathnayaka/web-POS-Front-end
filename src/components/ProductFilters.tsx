import { Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCategory, setSearchTerm, clearFilters } from '../store/productsSlice';

const ProductFilters = () => {
  const dispatch = useAppDispatch();
  const { category, searchTerm } = useAppSelector((state) => state.products.filters);
  const products = useAppSelector((state) => state.products.products);

  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="search"
              type="text"
              placeholder="Search by name or barcode..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>
        </div>

        <div className="md:w-64">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => dispatch(setCategory(e.target.value))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || category !== 'all') && (
          <div className="flex items-end">
            <button
              onClick={() => dispatch(clearFilters())}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
