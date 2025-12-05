import React, { useState, useEffect } from 'react';
import { Home, Calculator, Search, Map, BarChart3, User, LogOut, Menu, X, Heart, DollarSign, Bed, MapPin, TrendingUp, Info, HelpCircle } from 'lucide-react';

const API_BASE = 'http://localhost:4000/api';

// Main App Component
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  if (!currentUser) {
    return <AuthPage setCurrentUser={setCurrentUser} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">NYC Housing</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<Home size={20} />} text="Dashboard" active={activePage === 'dashboard'} 
            onClick={() => setActivePage('dashboard')} collapsed={!sidebarOpen} />
          <NavItem icon={<Calculator size={20} />} text="Budget Calculator" active={activePage === 'calculator'} 
            onClick={() => setActivePage('calculator')} collapsed={!sidebarOpen} />
          <NavItem icon={<Search size={20} />} text="Search Properties" active={activePage === 'search'} 
            onClick={() => setActivePage('search')} collapsed={!sidebarOpen} />
          <NavItem icon={<Heart size={20} />} text="Saved Properties" active={activePage === 'saved'} 
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
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'calculator' && <BudgetCalculator />}
        {activePage === 'search' && <PropertySearch />}
        {activePage === 'saved' && <SavedProperties />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'help' && <HelpPage />}
      </main>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, text, active, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
        active ? 'bg-blue-700' : 'hover:bg-blue-700'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      {icon}
      {!collapsed && <span>{text}</span>}
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
          <h1 className="text-3xl font-bold text-gray-800">NYC Housing Finder</h1>
          <p className="text-gray-600 mt-2">Find your affordable dream home</p>
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
        <StatCard icon={<Home />} title="Total Properties" value={stats?.total || 0} color="blue" />
        <StatCard icon={<DollarSign />} title="Avg Price" value={`$${stats?.avgPrice?.toLocaleString() || 0}`} color="green" />
        <StatCard icon={<TrendingUp />} title="Lowest Price" value={`$${stats?.minPrice?.toLocaleString() || 0}`} color="purple" />
        <StatCard icon={<Bed />} title="Avg Bedrooms" value={stats?.avgBedrooms?.toFixed(1) || 0} color="orange" />
      </div>

      {/* Featured Properties */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Properties</h2>
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
    loanTerm: '30'
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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
              <input
                type="number"
                value={formData.downPayment}
                onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
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
        {result && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Results</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Max Monthly Housing Budget</p>
                <p className="text-3xl font-bold text-blue-600">${result.maxMonthlyBudget.toLocaleString()}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Affordable Price Range</p>
                <p className="text-2xl font-bold text-green-600">
                  ${result.affordablePriceRange.min.toLocaleString()} - ${result.affordablePriceRange.max.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly Gross Income:</span>
                    <span className="font-semibold">${(result.monthlyGrossIncome || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debt-to-Income Ratio:</span>
                    <span className="font-semibold">{result.dti}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Property Search Component
function PropertySearch() {
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
        <h1 className="text-3xl font-bold text-gray-800">Search Properties</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
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
      <p className="text-gray-600 mb-4">{properties.length} properties found</p>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Saved Properties</h1>
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No saved properties yet. Start exploring and save your favorites!</p>
      </div>
    </div>
  );
}

// About Page Component
function AboutPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About NYC Housing Finder</h1>
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            NYC Housing Finder is dedicated to helping individuals and families find affordable housing options
            in New York City. We understand that finding the right home within your budget can be challenging,
            which is why we've created a comprehensive platform that simplifies the search process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Features</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Advanced budget calculator to determine your affordable price range</li>
            <li>Comprehensive property search with multiple filtering options</li>
            <li>Total cost calculation including mortgage, taxes, insurance, and commute costs</li>
            <li>Interactive map view to explore properties by location</li>
            <li>Quick comparison tools to evaluate multiple properties side-by-side</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Technology</h2>
          <p className="text-gray-700 leading-relaxed">
            Built with modern web technologies including React, Node.js, Express, and PostgreSQL,
            our platform provides a fast, reliable, and user-friendly experience.
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
            <li>Search for properties using various filters</li>
            <li>Save your favorite properties for later review</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Using the Budget Calculator</h2>
          <p className="text-gray-700 mb-3">
            The budget calculator helps you understand how much you can afford based on:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Annual Salary:</strong> Your total yearly income before taxes</li>
            <li><strong>Monthly Debts:</strong> All recurring monthly debt payments (car loans, student loans, etc.)</li>
            <li><strong>Down Payment:</strong> The amount you plan to put down upfront</li>
            <li><strong>Interest Rate:</strong> Current mortgage interest rate (default: 6.5%)</li>
            <li><strong>Loan Term:</strong> Length of the mortgage (15 or 30 years)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Understanding Total Monthly Costs</h2>
          <p className="text-gray-700 mb-3">
            Each property shows a total monthly cost that includes:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Mortgage payment (principal and interest)</li>
            <li>Property taxes</li>
            <li>Homeowner's insurance</li>
            <li>Estimated commute costs</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Need More Help?</h2>
          <p className="text-gray-700">
            For additional support or questions, please contact our team at support@nychousing.com
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

function PropertyCard({ property }) {
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
        <p className="text-gray-600 mb-3">{property.address}</p>
        <div className="flex gap-4 mb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Bed size={16} /> {property.bedrooms} bed
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={16} /> {property.neighborhood}
          </span>
        </div>
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-1">Total Monthly Cost</p>
          <p className="text-2xl font-bold text-green-600">${property.total_monthly_cost?.toLocaleString() || 'N/A'}</p>
          {property.total_monthly_cost && (
            <div className="mt-2 text-xs text-gray-500 space-y-1">
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
  const countyPositions = {
    'Manhattan': { x: 50, y: 30 },
    'Brooklyn': { x: 60, y: 60 },
    'Queens': { x: 70, y: 50 },
    'Bronx': { x: 55, y: 15 },
    'Staten Island': { x: 30, y: 75 }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Map View</h2>
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-96 overflow-hidden">
        {properties.map((property, idx) => {
          const pos = countyPositions[property.county] || { x: 50, y: 50 };
          const offset = idx % 3 * 5;
          return (
            <div
              key={property.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${pos.x + offset}%`, top: `${pos.y + offset}%` }}
            >
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg group-hover:scale-150 transition-transform" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                <div className="bg-white rounded-lg shadow-xl p-3 whitespace-nowrap text-sm">
                  <p className="font-bold">${property.price.toLocaleString()}</p>
                  <p className="text-gray-600">{property.neighborhood}</p>
                  <p className="text-gray-500">{property.bedrooms} bed</p>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* County Labels */}
        {Object.entries(countyPositions).map(([county, pos]) => (
          <div
            key={county}
            className="absolute text-gray-700 font-semibold text-lg"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            {county}
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Hover over markers to see property details</p>
      </div>
    </div>
  );
}