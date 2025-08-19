import React from 'react';
import { User, ShoppingBag, Heart, Clock } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductRecommendations from './ProductRecommendations';
import SuggestedProducts from './SuggestedProducts';

interface PersonalizedDashboardProps {
  products: Product[];
}

const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({ products }) => {
  const { user, userProfile } = useAuth();
  const { items, itemCount } = useCart();

  if (!user || !userProfile) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {getGreeting()}, {userProfile.name}! 👋
              </h2>
              <p className="text-gray-600">
                Welcome back to Joy Shop. Here's what we've picked just for you.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-2">
                  <ShoppingBag className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">Cart Items</p>
                <p className="font-semibold text-gray-900">{itemCount}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-2">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <p className="text-sm text-gray-600">Wishlist</p>
                <p className="font-semibold text-gray-900">12</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Recent Orders</p>
                <p className="font-semibold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Suggestions */}
        <div className="mb-12">
          <SuggestedProducts 
            products={products}
            maxItems={4}
            title="Recommended for You"
            subtitle="Based on your shopping history and preferences"
          />
        </div>

        {/* Recommendation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ProductRecommendations
            products={products}
            type="trending"
            title="Trending Now"
            maxItems={4}
          />
          
          <ProductRecommendations
            products={products}
            type="popular"
            title="Most Popular"
            maxItems={4}
          />
          
          <ProductRecommendations
            products={products}
            type="wishlist"
            title="From Your Wishlist"
            maxItems={4}
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingBag className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">View Cart</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="h-8 w-8 text-pink-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Wishlist</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <Clock className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Order History</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <User className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedDashboard;