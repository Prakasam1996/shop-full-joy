import React from 'react';
import * as Icons from 'lucide-react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<any>;
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
            selectedCategory === 'all'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Icons.Grid3X3 className="h-5 w-5" />
            <span className="font-medium">All Products</span>
          </div>
          <span className="text-sm text-gray-500">
            {categories.reduce((sum, cat) => sum + cat.count, 0)}
          </span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
              selectedCategory === category.id
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              {getIcon(category.icon)}
              <span className="font-medium">{category.name}</span>
            </div>
            <span className="text-sm text-gray-500">{category.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;