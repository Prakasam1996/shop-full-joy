import React, { useMemo } from 'react';
import { Star, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';

interface SuggestedProductsProps {
  products: Product[];
  currentProduct?: Product;
  maxItems?: number;
  title?: string;
  subtitle?: string;
}

const SuggestedProducts: React.FC<SuggestedProductsProps> = ({
  products,
  currentProduct,
  maxItems = 4,
  title = "You Might Also Like",
  subtitle = "Handpicked recommendations just for you"
}) => {
  const { items: cartItems } = useCart();

  const suggestedProducts = useMemo(() => {
    let suggestions: Product[] = [];

    // Get categories from cart items
    const cartCategories = cartItems.map(item => item.product.category);
    
    // Get current product category
    const currentCategory = currentProduct?.category;

    // Filter out current product and products already in cart
    const availableProducts = products.filter(product => {
      const isCurrentProduct = currentProduct && product.id === currentProduct.id;
      const isInCart = cartItems.some(item => item.product.id === product.id);
      return !isCurrentProduct && !isInCart && product.inStock;
    });

    // Priority 1: Same category as current product
    if (currentCategory) {
      const sameCategoryProducts = availableProducts.filter(
        product => product.category === currentCategory
      );
      suggestions.push(...sameCategoryProducts.slice(0, 2));
    }

    // Priority 2: Same categories as cart items
    if (cartCategories.length > 0) {
      const cartCategoryProducts = availableProducts.filter(
        product => cartCategories.includes(product.category) && 
        !suggestions.some(s => s.id === product.id)
      );
      suggestions.push(...cartCategoryProducts.slice(0, 2));
    }

    // Priority 3: Featured products
    const featuredProducts = availableProducts.filter(
      product => product.featured && !suggestions.some(s => s.id === product.id)
    );
    suggestions.push(...featuredProducts.slice(0, 2));

    // Priority 4: High-rated products
    const highRatedProducts = availableProducts
      .filter(product => product.rating >= 4.5 && !suggestions.some(s => s.id === product.id))
      .sort((a, b) => b.rating - a.rating);
    suggestions.push(...highRatedProducts.slice(0, 2));

    // Priority 5: Popular products (by review count)
    const popularProducts = availableProducts
      .filter(product => !suggestions.some(s => s.id === product.id))
      .sort((a, b) => b.reviews - a.reviews);
    suggestions.push(...popularProducts.slice(0, 2));

    // Remove duplicates and limit to maxItems
    const uniqueSuggestions = suggestions.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );

    return uniqueSuggestions.slice(0, maxItems);
  }, [products, currentProduct, cartItems, maxItems]);

  if (suggestedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wide">
              Personalized for You
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {suggestedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <button className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium group">
            <span>View More Recommendations</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuggestedProducts;