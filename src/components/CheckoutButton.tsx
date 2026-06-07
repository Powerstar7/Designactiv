import React from 'react';
import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { StripeProduct } from '../stripe-config';

interface CheckoutButtonProps {
  product: StripeProduct;
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({ product, className = '', children }: CheckoutButtonProps) {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <button
      onClick={handleCheckout}
      className={`
        inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold
        bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700
        text-white shadow-lg hover:shadow-xl transition-all duration-200
        ${className}
      `}
    >
      <CreditCard className="w-4 h-4" />
      {children || 'Get Access Now'}
    </button>
  );
}
