import React, { useState, useMemo } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import FeaturedProducts from './components/FeaturedProducts';
import SuggestedProducts from './components/SuggestedProducts';
import PersonalizedDashboard from './components/PersonalizedDashboard';
import Cart from './components/Cart';
import AuthModal from './components/auth/AuthModal';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { products, categories } from './data/products';
import { Filter, SortAsc } from 'lucide-react';

function App() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            onCartClick={() => setIsCartOpen(true)}
            onSearchChange={setSearchQuery}
            onAuthClick={() => setIsAuthModalOpen(true)}
          />
        
          <Hero />
        
          {user && <PersonalizedDashboard products={products} />}
        
          <FeaturedProducts products={products} />

          {/* Suggested Products for logged-in users */}
          {user && (
            <SuggestedProducts 
              products={products}
              maxItems={4}
              title="Because You Viewed"
              subtitle="Products similar to items in your cart and browsing history"
            />
          )}

          {/* Products Section */}
          <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Desktop */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Mobile Filters & Sort */}
                <div className="lg:hidden mb-6 flex items-center justify-between">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="h-5 w-5" />
                    <span>Filters</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <SortAsc className="h-5 w-5 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>

                {/* Mobile Filters */}
                {showFilters && (
                  <div className="lg:hidden mb-6">
                    <CategoryFilter
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onCategoryChange={(category) => {
                        setSelectedCategory(category);
                        setShowFilters(false);
                      }}
                    />
                  </div>
                )}

                {/* Desktop Sort */}
                <div className="hidden lg:flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === 'all' ? 'All Products' : 
                     categories.find(cat => cat.id === selectedCategory)?.name || 'Products'}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({filteredProducts.length} items)
                    </span>
                  </h2>

                  <div className="flex items-center space-x-2">
                    <SortAsc className="h-5 w-5 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Filter className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          </section>

          {/* Additional Suggestions at Bottom */}
          {!user && (
            <SuggestedProducts 
              products={products}
              maxItems={4}
              title="Popular Right Now"
              subtitle="See what other customers are loving"
            />
          )}

          <Footer />
        
          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;