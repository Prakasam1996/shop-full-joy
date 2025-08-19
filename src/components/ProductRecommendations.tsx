import React from 'react';
import { Heart, TrendingUp, Users } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductRecommendationsProps {
  products: Product[];
  type: 'trending' | 'popular' | 'wishlist';
  title: string;
  maxItems?: number;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  products,
  type,
  title,
  maxItems = 4
}) => {
  const getIcon = () => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'popular':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'wishlist':
        return <Heart className="h-5 w-5 text-red-600" />;
      default:
        return <TrendingUp className="h-5 w-5 text-purple-600" />;
    }
  };

  const getFilteredProducts = () => {
    let filtered = products.filter(product => product.inStock);
    
    switch (type) {
      case 'trending':
        // Sort by rating and recent popularity (using reviews as proxy)
        return filtered
          .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
          .slice(0, maxItems);
      
      case 'popular':
        // Sort by review count
        return filtered
          .sort((a, b) => b.reviews - a.reviews)
          .slice(0, maxItems);
      
      case 'wishlist':
        // Show featured products as wishlist items
        return filtered
          .filter(product => product.featured)
          .slice(0, maxItems);
      
      default:
        return filtered.slice(0, maxItems);
    }
  };

  const recommendedProducts = getFilteredProducts();

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        {getIcon()}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendedProducts.map((product) => (
          <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate text-sm">
                {product.name}
              </h4>
              <p className="text-xs text-gray-500 capitalize mb-1">
                {product.category}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-purple-600">
                  ${product.price}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-yellow-500">★</span>
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;