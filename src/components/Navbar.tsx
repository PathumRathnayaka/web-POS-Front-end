import { LayoutDashboard, Package, Users, ShoppingCart, UserCircle } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'suppliers', label: 'Suppliers', icon: Users },
  { id: 'sales', label: 'Sales', icon: ShoppingCart },
  { id: 'customers', label: 'Customers', icon: UserCircle },
];

export default function Navbar({ activePage, onPageChange }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">WebPOS</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Point of Sale</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
