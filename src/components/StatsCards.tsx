import { Package, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAppSelector } from '../store/hooks';

const StatsCards = () => {
  const products = useAppSelector((state) => state.products.products);

  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + (p.quantities?.quantity_size || 0), 0);
  const lowStockCount = products.filter((p) => (p.quantities?.quantity_size || 0) < 30 && (p.quantities?.quantity_size || 0) > 0).length;
  const outOfStockCount = products.filter((p) => (p.quantities?.quantity_size || 0) === 0).length;

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Total Units',
      value: totalQuantity,
      icon: ShoppingCart,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Low Stock',
      value: lowStockCount,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      label: 'Out of Stock',
      value: outOfStockCount,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
