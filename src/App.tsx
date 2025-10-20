import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Sales from './pages/Sales';
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
      case 'customers':
        return <Customers />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage={activePage} onPageChange={setActivePage} />
      <main className="p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
