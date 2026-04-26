export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  currencySymbol: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_L5JvWiarSUZqaa',
    priceId: 'price_1KP9HVHfhBIMfl3soSGoGMyi',
    name: 'Pacote Básico',
    description: 'Access to basic features and tools',
    price: 18.00,
    currency: 'eur',
    currencySymbol: '€',
    mode: 'payment',
  },
  {
    id: 'prod_L5Jtf3Xx3pvgZY',
    priceId: 'price_1KP9FxHfhBIMfl3ssFIodkEm',
    name: 'Premium Package',
    description: 'Full access to all premium features',
    price: 18.00,
    currency: 'eur',
    currencySymbol: '€',
    mode: 'payment',
  },
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}