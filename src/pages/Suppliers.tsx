import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSuppliers, searchSuppliers, setSearchTerm } from '../store/suppliersSlice';
import { Search, Users } from 'lucide-react';

export default function Suppliers() {
  const dispatch = useAppDispatch();
  const { suppliers, products, loading, searchTerm } = useAppSelector((state) => state.suppliers);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value));
    if (value.trim()) {
      dispatch(searchSuppliers(value));
    } else {
      dispatch(fetchSuppliers());
    }
  };

  const suppliersWithProducts = useMemo(() => {
    return suppliers.map((supplier) => ({
      ...supplier,
      productCount: products.filter((p) => p.supplier_id === supplier.id).length,
    }));
  }, [suppliers, products]);

  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return suppliersWithProducts.slice(start, start + itemsPerPage);
  }, [suppliersWithProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(suppliersWithProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600 mt-1">Manage your supplier relationships</p>
        </div>
        <div className="flex items-center gap-2 bg-cyan-50 px-4 py-2 rounded-lg">
          <Users className="w-5 h-5 text-cyan-600" />
          <span className="text-sm font-medium text-cyan-900">{suppliersWithProducts.length} Suppliers</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Products
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {supplier.contact_person}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{supplier.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{supplier.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{supplier.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {supplier.productCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
