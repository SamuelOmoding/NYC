import React, { useState, useEffect } from 'react';
import { Home, Calculator, Search, Map, BarChart3, User, LogOut, Menu, X, Heart, DollarSign, Bed, MapPin, TrendingUp, Info, HelpCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Main App Component
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setActivePage('login');
  };

  const addToCompare = (property) => {
    if (compareList.length >= 3) {
      alert('You can only compare up to 3 properties at a time');
      return;
    }
    if (compareList.find(p => p.id === property.id)) {
      alert('Property already in comparison list');
      return;
    }
    setCompareList([...compareList, property]);
  };

  const removeFromCompare = (propertyId) => {
    setCompareList(compareList.filter(p => p.id !== propertyId));
  };

  if (!currentUser) {
    return <AuthPage setCurrentUser={setCurrentUser} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">NYC Affordable Housing</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<Home size={20} />} text="Dashboard" active={activePage === 'dashboard'} 
            onClick={() => setActivePage('dashboard')} collapsed={!sidebarOpen} />
          <NavItem icon={<Calculator size={20} />} text="Budget Calculator" active={activePage === 'calculator'} 
            onClick={() => setActivePage('calculator')} collapsed={!sidebarOpen} />
          <NavItem icon={<Search size={20} />} text="Search Housing" active={activePage === 'search'} 
            onClick={() => setActivePage('search')} collapsed={!sidebarOpen} />
          <NavItem icon={<BarChart3 size={20} />} text="Compare" active={activePage === 'compare'} 
            onClick={() => setActivePage('compare')} collapsed={!sidebarOpen} 
            badge={compareList.length > 0 ? compareList.length : null} />
          <NavItem icon={<Heart size={20} />} text="Saved Units" active={activePage === 'saved'} 
            onClick={() => setActivePage('saved')} collapsed={!sidebarOpen} />
          <NavItem icon={<Info size={20} />} text="About" active={activePage === 'about'} 
            onClick={() => setActivePage('about')} collapsed={!sidebarOpen} />
          <NavItem icon={<HelpCircle size={20} />} text="Help" active={activePage === 'help'} 
            onClick={() => setActivePage('help')} collapsed={!sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-blue-700">
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <User size={20} />
                <span className="text-sm">{currentUser.name}</span>
              </div>
            )}
            <button onClick={handleLogout} className="p-2 hover:bg-blue-700 rounded" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activePage === 'dashboard' && <Dashboard addToCompare={addToCompare} />}
        {activePage === 'calculator' && <BudgetCalculator />}
        {activePage === 'search' && <PropertySearch addToCompare={addToCompare} />}
        {activePage === 'compare' && <CompareView compareList={compareList} removeFromCompare={removeFromCompare} />}
        {activePage === 'saved' && <SavedProperties />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'help' && <HelpPage />}
      </main>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, text, active, onClick, collapsed, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors relative ${
        active ? 'bg-blue-700' : 'hover:bg-blue-700'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      {icon}
      {!collapsed && <span>{text}</span>}
      {badge && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

// Auth Page Component
function AuthPage({ setCurrentUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await fetch(API_BASE + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Home className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">NYC Affordable Housing Finder</h1>
          <p className="text-gray-600 mt-2">Find affordable apartments, condos & co-ops in NYC</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline text-sm"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-600">
          <p className="font-semibold">Demo Account:</p>
          <p>Email: demo@demo.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_BASE}/properties?limit=6`);
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/properties/stats`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Home />} title="Available Units" value={stats?.total || 0} color="blue" />
        <StatCard icon={<DollarSign />} title="Avg Price" value={`${stats?.avgPrice?.toLocaleString() || 0}`} color="green" />
        <StatCard icon={<TrendingUp />} title="Starting From" value={`${stats?.minPrice?.toLocaleString() || 0}`} color="purple" />
        <StatCard icon={<Bed />} title="Avg Bedrooms" value={stats?.avgBedrooms?.toFixed(1) || 0} color="orange" />
      </div>

      {/* Featured Properties */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Affordable Housing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>

      {/* Quick Comparison */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Most Affordable Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.slice(0, 3).map(property => (
            <ComparisonCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Budget Calculator Component
function BudgetCalculator() {
  const [formData, setFormData] = useState({
    annualSalary: '',
    monthlyDebts: '',
    downPayment: '',
    interestRate: '6.5',
    loanTerm: '30',
    workAddress: ''
  });
  const [result, setResult] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/calculator/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error calculating budget:', err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Budget Calculator</h1>
      <p className="text-gray-600 mb-6">Enter your financial information to calculate what you can truly afford, including all costs of homeownership.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Financial Information</h2>
          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary ($)</label>
              <input
                type="number"
                value={formData.annualSalary}
                onChange={(e) => setFormData({ ...formData, annualSalary: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 80000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Debts ($)</label>
              <input
                type="number"
                value={formData.monthlyDebts}
                onChange={(e) => setFormData({ ...formData, monthlyDebts: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Include car loans, student loans, credit cards, etc.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
              <input
                type="number"
                value={formData.downPayment}
                onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 50000"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Typically 10-20% of home price</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Address (for commute calculation)</label>
              <input
                type="text"
                value={formData.workAddress}
                onChange={(e) => setFormData({ ...formData, workAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Manhattan, NY"
              />
              <p className="text-xs text-gray-500 mt-1">Used to estimate commute costs</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
              <select
                value={formData.loanTerm}
                onChange={(e) => setFormData({ ...formData, loanTerm: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="15">15 years</option>
                <option value="30">30 years</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Calculate Budget
            </button>
          </form>
        </div>

        {/* Results */}
        {result ? (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Affordable Housing Budget</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Max Monthly Housing Budget</p>
                <p className="text-3xl font-bold text-blue-600">${result.maxMonthlyBudget.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Based on 43% debt-to-income ratio</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Affordable Price Range</p>
                <p className="text-2xl font-bold text-green-600">
                  ${result.affordablePriceRange.min.toLocaleString()} - ${result.affordablePriceRange.max.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Recommended down payment: ${formData.downPayment.toLocaleString()}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Financial Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly Gross Income:</span>
                    <span className="font-semibold">${(result.monthlyGrossIncome || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Existing Monthly Debts:</span>
                    <span className="font-semibold">${formData.monthlyDebts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debt-to-Income Ratio:</span>
                    <span className="font-semibold">{result.dti}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 text-white rounded-lg p-4">
                <p className="font-semibold mb-2">Ready to search?</p>
                <p className="text-sm mb-3">Find housing units within your budget range</p>
                <button 
                  onClick={() => window.location.hash = '#search'}
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Search Properties
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <Calculator className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Enter your information and click Calculate to see your budget</p>
            </div>
          </div>
        )}
      </div>

      {/* Information Panel */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-2">💡 Understanding Total Cost of Ownership</h3>
        <p className="text-sm text-gray-700">
          Our calculator goes beyond the listing price to show your true affordability. We factor in mortgage payments, 
          property taxes (varies by county), homeowner's insurance, and estimated commute costs based on your work location. 
          This comprehensive approach helps you understand the full picture of homeownership costs.
        </p>
      </div>
    </div>
  );
}

// Property Search Component
function PropertySearch({ addToCompare }) {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    county: ''
  });
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.county) params.append('county', filters.county);

      const response = await fetch(`${API_BASE}/properties?${params}`);
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Search Affordable Housing</h1>
          <p className="text-gray-600 mt-1">Filter by price, location, and bedrooms to find your perfect unit</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Home size={16} /> Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Map size={16} /> Map
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="font-semibold mb-4">Filter Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Bedrooms"
            value={filters.bedrooms}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.county}
            onChange={(e) => setFilters({ ...filters, county: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Counties</option>
            <option value="Manhattan">Manhattan</option>
            <option value="Brooklyn">Brooklyn</option>
            <option value="Queens">Queens</option>
            <option value="Bronx">Bronx</option>
            <option value="Staten Island">Staten Island</option>
          </select>
          <button
            onClick={() => setFilters({ minPrice: '', maxPrice: '', bedrooms: '', county: '' })}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <p className="text-gray-600 mb-4">{properties.length} affordable units found</p>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} addToCompare={addToCompare} />
          ))}
        </div>
      ) : (
        <MapView properties={properties} />
      )}
    </div>
  );
}

// Saved Properties Component
function SavedProperties() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Saved Housing Units</h1>
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No saved units yet. Start exploring and save your favorites!</p>
      </div>
    </div>
  );
}

// Compare View Component
function CompareView({ compareList, removeFromCompare }) {
  if (compareList.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Compare Properties</h1>
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No properties selected for comparison</p>
          <p className="text-sm text-gray-500">Add properties from the search page to compare them side-by-side</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Compare Properties</h1>
          <p className="text-gray-600 mt-1">Side-by-side comparison of {compareList.length} {compareList.length === 1 ? 'unit' : 'units'}</p>
        </div>
        <button
          onClick={() => compareList.forEach(p => removeFromCompare(p.id))}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          Clear All
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-48">Attribute</th>
                {compareList.map(property => (
                  <th key={property.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => removeFromCompare(property.id)}
                      className="text-red-600 hover:text-red-800 float-right"
                    >
                      <X size={16} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Image Row */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700">Image</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center">
                    <div className="h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg flex items-center justify-center">
                      <Home className="w-12 h-12 text-white" />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Address Row */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700">Address</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">{property.address}</td>
                ))}
              </tr>

              {/* Neighborhood Row */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700">Neighborhood</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">{property.neighborhood}</td>
                ))}
              </tr>

              {/* County Row */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700">County</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">{property.county}</td>
                ))}
              </tr>

              {/* Price Row */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700">Price</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-blue-600">${property.price.toLocaleString()}</span>
                  </td>
                ))}
              </tr>

              {/* Total Monthly Cost Row */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700">Total Monthly Cost</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-green-600">${property.total_monthly_cost?.toLocaleString() || 'N/A'}</span>
                  </td>
                ))}
              </tr>

              {/* Bedrooms Row */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700">Bedrooms</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">{property.bedrooms}</td>
                ))}
              </tr>

              {/* Bathrooms Row */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700">Bathrooms</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">{property.bathrooms}</td>
                ))}
              </tr>

              {/* Square Feet Row */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700">Square Feet</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">{property.square_feet?.toLocaleString() || 'N/A'}</td>
                ))}
              </tr>

              {/* Property Type Row */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700">Type</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">{property.property_type}</td>
                ))}
              </tr>

              {/* Year Built Row */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700">Year Built</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">{property.year_built || 'N/A'}</td>
                ))}
              </tr>

              {/* Cost Breakdown Header */}
              <tr className="bg-blue-50">
                <td colSpan={compareList.length + 1} className="px-6 py-3 font-semibold text-gray-800">
                  Monthly Cost Breakdown
                </td>
              </tr>

              {/* Mortgage Row */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700">Mortgage</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">
                    ${property.cost_breakdown?.mortgage.toLocaleString() || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Property Tax Row */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700">Property Tax</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">
                    ${property.cost_breakdown?.property_tax.toLocaleString() || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Insurance Row */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700">Insurance</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">
                    ${property.cost_breakdown?.insurance.toLocaleString() || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Commute Row */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700">Commute Cost</td>
                {compareList.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center text-sm">
                    ${property.cost_breakdown?.commute.toLocaleString() || 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-3">💡 Comparison Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Lowest Price:</p>
            <p className="font-bold text-blue-600">
              ${Math.min(...compareList.map(p => p.price)).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Lowest Monthly Cost:</p>
            <p className="font-bold text-green-600">
              ${Math.min(...compareList.map(p => p.total_monthly_cost || 0)).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Best Value:</p>
            <p className="font-bold text-purple-600">
              {compareList.reduce((best, curr) => 
                (curr.total_monthly_cost || Infinity) < (best.total_monthly_cost || Infinity) ? curr : best
              ).neighborhood}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// About Page Component
function AboutPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About NYC Affordable Housing Finder</h1>
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            NYC Affordable Housing Finder is dedicated to helping individuals and families find affordable 
            apartments, condos, and co-ops in New York City. We understand that finding quality housing 
            within your budget can be challenging in one of the world's most expensive cities, which is why 
            we've created a comprehensive platform that simplifies the search process and provides true 
            affordability calculations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Curated listings of affordable apartments, condos, and co-ops across all five boroughs</li>
            <li>Advanced budget calculator to determine your true affordable price range</li>
            <li>Comprehensive total cost calculation including mortgage, taxes, insurance, and commute costs</li>
            <li>Interactive map view to explore housing by neighborhood and borough</li>
            <li>Flexible filtering by price, bedrooms, and location</li>
            <li>Quick comparison tools to evaluate multiple units side-by-side</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Housing Types We Feature</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Condos</h3>
              <p className="text-sm text-gray-600">Own your unit with flexible financing options and building amenities</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Co-ops</h3>
              <p className="text-sm text-gray-600">Affordable ownership through cooperative housing with community benefits</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Apartments</h3>
              <p className="text-sm text-gray-600">Rental and ownership options in managed buildings throughout NYC</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Technology</h2>
          <p className="text-gray-700 leading-relaxed">
            Built with modern web technologies including React, Node.js, Express, and PostgreSQL,
            our platform provides a fast, reliable, and user-friendly experience for your housing search.
          </p>
        </section>
      </div>
    </div>
  );
}

// Help Page Component
function HelpPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Help & Documentation</h1>
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Getting Started</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Create an account or login with the demo credentials</li>
            <li>Use the Budget Calculator to determine your affordable price range</li>
            <li>Search for housing units using various filters (price, bedrooms, borough)</li>
            <li>View units on the map to understand neighborhood locations</li>
            <li>Save your favorite units for later review</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Using the Budget Calculator</h2>
          <p className="text-gray-700 mb-3">
            The budget calculator helps you understand how much you can afford based on:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Annual Salary:</strong> Your total yearly income before taxes</li>
            <li><strong>Monthly Debts:</strong> All recurring monthly debt payments (car loans, student loans, credit cards, etc.)</li>
            <li><strong>Down Payment:</strong> The amount you plan to put down upfront (typically 10-20%)</li>
            <li><strong>Interest Rate:</strong> Current mortgage interest rate (default: 6.5%)</li>
            <li><strong>Loan Term:</strong> Length of the mortgage (15 or 30 years)</li>
          </ul>
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> Lenders typically use a 43% debt-to-income ratio. Our calculator ensures you stay within safe affordability limits.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Understanding Total Monthly Costs</h2>
          <p className="text-gray-700 mb-3">
            Each housing unit shows a total monthly cost that includes:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Mortgage Payment:</strong> Principal and interest based on 20% down payment</li>
            <li><strong>Property Taxes:</strong> Estimated at 1.5% annually (varies by location)</li>
            <li><strong>Homeowner's Insurance:</strong> Estimated at 0.5% annually</li>
            <li><strong>Commute Costs:</strong> Estimated monthly transportation based on borough location</li>
          </ul>
          <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Note:</strong> These are estimates. Actual costs may vary. Always verify with sellers and lenders.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Housing Types Explained</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-800">Condo (Condominium)</h3>
              <p className="text-gray-600 text-sm">You own your individual unit and a share of common areas. More financing flexibility than co-ops.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Co-op (Cooperative)</h3>
              <p className="text-gray-600 text-sm">You buy shares in a corporation that owns the building. Typically more affordable but with stricter approval process.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Apartment</h3>
              <p className="text-gray-600 text-sm">Rental units or apartments available for purchase in managed buildings.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Using the Map View</h2>
          <p className="text-gray-700 mb-2">
            The interactive map shows all five NYC boroughs with housing units marked by red pins:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Hover over any red marker to see unit details</li>
            <li>Units are grouped by borough for easy location browsing</li>
            <li>The legend shows how many units are available in each borough</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Need More Help?</h2>
          <p className="text-gray-700">
            For additional support or questions, please contact our team at <strong>support@nycaffordablehousing.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}

// Reusable Components

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className={`${colors[color]} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function PropertyCard({ property, addToCompare }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
        <Home className="w-16 h-16 text-white" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">${property.price.toLocaleString()}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{property.county}</span>
        </div>
        <p className="text-gray-600 mb-1 text-sm">{property.address}</p>
        <p className="text-gray-500 text-xs mb-3">{property.neighborhood}</p>
        <div className="flex gap-4 mb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Bed size={16} /> {property.bedrooms} bed
          </span>
          <span>•</span>
          <span>{property.bathrooms} bath</span>
          <span>•</span>
          <span className="text-xs">{property.property_type}</span>
        </div>
        <div className="border-t pt-4 mb-4">
          <p className="text-sm text-gray-600 mb-1">Total Monthly Cost</p>
          <p className="text-2xl font-bold text-green-600">${property.total_monthly_cost?.toLocaleString() || 'N/A'}</p>
          {property.total_monthly_cost && (
            <div className="mt-3 text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Mortgage:</span>
                <span>${property.cost_breakdown?.mortgage.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Property Tax:</span>
                <span>${property.cost_breakdown?.property_tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance:</span>
                <span>${property.cost_breakdown?.insurance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Commute:</span>
                <span>${property.cost_breakdown?.commute.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
        {addToCompare && (
          <div className="flex gap-2">
            <button
              onClick={() => addToCompare(property)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <BarChart3 size={16} /> Compare
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart size={16} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ComparisonCard({ property }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-800">{property.neighborhood}</h3>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Best Value</span>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">Price</p>
          <p className="text-xl font-bold text-blue-600">${property.price.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Monthly Cost</p>
          <p className="text-xl font-bold text-green-600">${property.total_monthly_cost?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="flex gap-4 text-sm">
          <span>{property.bedrooms} bed</span>
          <span>•</span>
          <span>{property.county}</span>
        </div>
      </div>
    </div>
  );
}

function MapView({ properties }) {
  const GOOGLE_MAPS_KEY = import.meta.env.map_api_key || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';

  // Generate markers parameter for Google Maps Static API
  const generateMarkersUrl = () => {
    if (!properties || properties.length === 0) return '';
    
    // NYC center coordinates
    const center = '40.7128,-74.0060';
    const zoom = '11';
    
    // Create markers string - color code by price
    const markers = properties.map(property => {
      const color = property.price < 350000 ? 'green' : 
                    property.price < 500000 ? 'blue' : 'red';
      return `markers=color:${color}%7Clabel:$%7C${property.latitude},${property.longitude}`;
    }).join('&');
    
    // Note: In production, you would use your own Google Maps API key
    // For this demo, we'll show an embedded map with property list overlay
    return `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY_HERE&center=${center}&zoom=${zoom}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-2xl font-bold mb-2">NYC Housing Map</h2>
        <p className="text-sm opacity-90">Properties shown with price-based color coding</p>
      </div>
      
      <div className="p-6">
        {/* Map Container with Interactive List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200" style={{ height: '600px' }}>
              {/* Embedded Google Maps */}
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_KEY}&center=40.7128,-74.0060&zoom=11&maptype=roadmap`}>
              </iframe>
              
              {/* Overlay info */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-blue-600" size={20} />
                  <span className="font-semibold text-gray-800">NYC Metro Area</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">Showing {properties.length} affordable housing units</p>
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">&lt;$350k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">$350k-$500k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">&gt;$500k</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Links */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                <strong>💡 View properties on interactive map:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {properties.slice(0, 6).map((property, idx) => (
                  <a
                    key={property.id}
                    href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-white border border-blue-300 rounded px-3 py-1 hover:bg-blue-100 transition-colors"
                  >
                    {property.neighborhood} - ${property.price.toLocaleString()}
                  </a>
                ))}
                {properties.length > 6 && (
                  <span className="text-xs text-gray-600 px-3 py-1">+{properties.length - 6} more</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Click any link to open exact location in Google Maps</p>
            </div>
          </div>

          {/* Property List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4 h-[600px] overflow-y-auto">
              <h3 className="font-semibold text-gray-800 mb-4 sticky top-0 bg-gray-50 pb-2">
                All Properties ({properties.length})
              </h3>
              <div className="space-y-3">
                {properties.map(property => {
                  const priceColor = property.price < 350000 ? 'text-green-600' : 
                                    property.price < 500000 ? 'text-blue-600' : 'text-red-600';
                  return (
                    <div key={property.id} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className={`text-lg font-bold ${priceColor}`}>
                            ${property.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">{property.neighborhood}</p>
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MapPin size={16} className="text-blue-600" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Bed size={12} /> {property.bedrooms} bed
                        </span>
                        <span>•</span>
                        <span>{property.county}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{property.property_type}</span>
                        <span className="font-semibold text-green-600">
                          ${property.total_monthly_cost?.toLocaleString() || 'N/A'}/mo
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Borough Statistics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'].map(county => {
            const countyProps = properties.filter(p => p.county === county);
            const avgPrice = countyProps.length > 0 
              ? Math.round(countyProps.reduce((sum, p) => sum + p.price, 0) / countyProps.length)
              : 0;
            return (
              <div key={county} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-gray-800">{county}</p>
                <p className="text-2xl font-bold text-blue-600">{countyProps.length}</p>
                <p className="text-xs text-gray-600">units</p>
                {avgPrice > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Avg: ${(avgPrice / 1000).toFixed(0)}k
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">🗺️ How to use the map:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Click any property link to view exact location on Google Maps</li>
            <li>• Properties are color-coded by price range (green = most affordable)</li>
            <li>• Use the property list on the right to browse all available units</li>
            <li>• Borough statistics show unit count and average prices per area</li>
          </ul>
        </div>
      </div>
    </div>
  );
}