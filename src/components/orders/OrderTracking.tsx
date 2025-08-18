import React from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Order } from '../../types';

interface OrderTrackingProps {
  order: Order;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-6 w-6 text-blue-500" />;
      case 'processing':
        return <Package className="h-6 w-6 text-purple-500" />;
      case 'shipped':
        return <Truck className="h-6 w-6 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'confirmed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'processing':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'shipped':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const trackingSteps = [
    { key: 'confirmed', label: 'Order Confirmed', description: 'Your order has been confirmed' },
    { key: 'processing', label: 'Processing', description: 'Your order is being prepared' },
    { key: 'shipped', label: 'Shipped', description: 'Your order is on its way' },
    { key: 'delivered', label: 'Delivered', description: 'Your order has been delivered' },
  ];

  const getCurrentStepIndex = () => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    return statusOrder.indexOf(order.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order Tracking</h3>
          <p className="text-sm text-gray-600">Order #{order.order_number}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </div>

      {order.tracking_number && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Tracking Number:</span>
            <span className="text-blue-800 font-mono">{order.tracking_number}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {trackingSteps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div key={step.key} className="flex items-center space-x-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                isCompleted 
                  ? 'bg-green-100 border-green-500' 
                  : isCurrent 
                    ? 'bg-purple-100 border-purple-500' 
                    : 'bg-gray-100 border-gray-300'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : isCurrent ? (
                  getStatusIcon(order.status)
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                )}
              </div>

              <div className="flex-1">
                <h4 className={`font-medium ${
                  isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </h4>
                <p className={`text-sm ${
                  isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
                {step.key === 'shipped' && order.shipped_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    Shipped on {new Date(order.shipped_at).toLocaleDateString()}
                  </p>
                )}
                {step.key === 'delivered' && order.delivered_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    Delivered on {new Date(order.delivered_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {index < trackingSteps.length - 1 && (
                <div className={`absolute left-5 mt-10 w-0.5 h-8 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Shipping Address</h4>
            <div className="text-sm text-gray-600">
              <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
              <p>{order.shipping_address.address_line_1}</p>
              {order.shipping_address.address_line_2 && (
                <p>{order.shipping_address.address_line_2}</p>
              )}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
              </p>
              <p>{order.shipping_address.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;