import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Sales from './pages/Sales';
import SaleItems from './pages/SaleItems';
import Customers from './pages/Customers';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'suppliers':
        return <Suppliers />;
      case 'sales':
        return <Sales />;
      case 'sale-items':
        return <SaleItems />;
      case 'customers':
        return <Customers />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />

      <div className="flex-1 lg:ml-0">
        <main className="p-6 lg:p-8 pt-16 lg:pt-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
