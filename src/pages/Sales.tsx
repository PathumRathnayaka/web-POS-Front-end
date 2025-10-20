import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSales, setSearchTerm, setDateRange, setPaymentMethod, clearFilters } from '../store/salesSlice';
import { Search, Filter, ShoppingCart, Package } from 'lucide-react';
import { Sale } from '../types';

export default function Sales() {
  const dispatch = useAppDispatch();
  const { sales, loading, filters } = useAppSelector((state) => state.sales);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  const paymentMethods = useMemo(() => {
    const methods = new Set(sales.filter(s => s.paymentMethod).map((s) => s.paymentMethod));
    return ['all', ...Array.from(methods)];
  }, [sales]);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const saleId = sale.saleId || '';
      const customerContact = sale.customerContact || '';

      const matchesSearch =
        saleId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        customerContact.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesPayment = filters.paymentMethod === 'all' || sale.paymentMethod === filters.paymentMethod;

      let matchesDate = true;
      if (filters.startDate && sale.saleDate) {
        try {
          matchesDate = matchesDate && new Date(sale.saleDate) >= new Date(filters.startDate);
        } catch {
          matchesDate = false;
        }
      }
      if (filters.endDate && sale.saleDate) {
        try {
          matchesDate = matchesDate && new Date(sale.saleDate) <= new Date(filters.endDate);
        } catch {
          matchesDate = false;
        }
      }

      return matchesSearch && matchesPayment && matchesDate;
    });
  }, [sales, filters]);

  const sortedSales = useMemo(() => {
    return [...filteredSales].sort((a, b) => {
      try {
        if (!a.saleDate || !b.saleDate) return 0;
        return new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime();
      } catch {
        return 0;
      }
    });
  }, [filteredSales]);

  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedSales.slice(start, start + itemsPerPage);
  }, [sortedSales, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedSales.length / itemsPerPage);

  const parseNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    return parseFloat(value) || 0;
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Sales & Items</h1>
          <p className="text-gray-600 mt-1">View sales transactions and their items</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
          <ShoppingCart className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-900">{sortedSales.length} Sales</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or customer..."
              value={filters.searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => dispatch(setDateRange({ startDate: e.target.value, endDate: filters.endDate }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => dispatch(setDateRange({ startDate: filters.startDate, endDate: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select
            value={filters.paymentMethod}
            onChange={(e) => dispatch(setPaymentMethod(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method === 'all' ? 'All Payment Methods' : method}
              </option>
            ))}
          </select>

          <button
            onClick={() => dispatch(clearFilters())}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Sales List</h2>
            <p className="text-sm text-gray-600 mt-1">Click a sale to view its items</p>
          </div>

          <div className="overflow-x-auto">
            {paginatedSales.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Sale ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedSales.map((sale) => (
                    <tr
                      key={sale.id}
                      onClick={() => setSelectedSale(sale)}
                      className={`hover:bg-blue-50 cursor-pointer transition-colors ${
                        selectedSale?.id === sale.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {sale.saleId || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {sale.customerContact || 'Walk-in'}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        ${parseNumber(sale.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {sale.paymentMethod || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No sales found
              </div>
            )}
          </div>

          {paginatedSales.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Sale Items</h2>
            <p className="text-sm text-gray-600 mt-1">Items for selected sale</p>
          </div>

          {selectedSale ? (
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Sale ID:</span>
                    <p className="font-semibold text-gray-900">{selectedSale.saleId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <p className="font-semibold text-gray-900">{selectedSale.customerContact || 'Walk-in'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedSale.saleDate).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment:</span>
                    <p className="font-semibold text-gray-900">{selectedSale.paymentMethod}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${parseNumber(selectedSale.subTotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-semibold">${parseNumber(selectedSale.taxAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-semibold">${parseNumber(selectedSale.discountAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-bold">Total:</span>
                    <span className="font-bold text-green-600">${parseNumber(selectedSale.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Items ({selectedSale.saleItems?.length || 0})</h3>
                </div>

                {selectedSale.saleItems && selectedSale.saleItems.length > 0 ? (
                  <div className="space-y-2">
                    {selectedSale.saleItems.map((item, index) => (
                      <div
                        key={`${item.productId}-${index}`}
                        className="flex justify-between items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">{item.category}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span>×</span>
                            <span>${parseNumber(item.unitPrice).toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${parseNumber(item.subTotal).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No items found
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Select a sale to view its items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
