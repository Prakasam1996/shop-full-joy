import React, { useState } from 'react';
import { Tag, Check, X } from 'lucide-react';
import { validateDiscountCode } from '../../lib/supabase';

interface DiscountCodeProps {
  orderAmount: number;
  onDiscountApplied: (discount: { code: string; amount: number; type: string }) => void;
  onDiscountRemoved: () => void;
  appliedDiscount?: { code: string; amount: number; type: string } | null;
}

const DiscountCode: React.FC<DiscountCodeProps> = ({
  orderAmount,
  onDiscountApplied,
  onDiscountRemoved,
  appliedDiscount,
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApplyDiscount = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const { data, error: validationError } = await validateDiscountCode(code, orderAmount);
      
      if (validationError || !data) {
        setError(validationError || 'Invalid discount code');
        return;
      }

      let discountAmount = 0;
      if (data.type === 'percentage') {
        discountAmount = (orderAmount * data.value) / 100;
        if (data.max_discount_amount) {
          discountAmount = Math.min(discountAmount, data.max_discount_amount);
        }
      } else {
        discountAmount = data.value;
      }

      onDiscountApplied({
        code: data.code,
        amount: discountAmount,
        type: data.type,
      });

      setCode('');
    } catch (err) {
      setError('Failed to apply discount code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    onDiscountRemoved();
    setError('');
  };

  if (appliedDiscount) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Discount Applied: {appliedDiscount.code}
            </span>
          </div>
          <button
            onClick={handleRemoveDiscount}
            className="text-green-600 hover:text-green-800 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-green-700 text-sm mt-1">
          You saved ${appliedDiscount.amount.toFixed(2)}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Tag className="h-5 w-5 text-gray-600" />
        <span className="font-medium text-gray-900">Discount Code</span>
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter discount code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={handleApplyDiscount}
          disabled={isLoading || !code.trim()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <p>Popular codes: WELCOME10, SAVE20, FREESHIP</p>
      </div>
    </div>
  );
};

export default DiscountCode;