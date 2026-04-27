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

const ENV_PRICE_ID = (import.meta.env.VITE_STRIPE_PRICE_ID as string | undefined) ?? '';

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_designactiv_lifetime',
    priceId: ENV_PRICE_ID || 'price_1KP9HVHfhBIMfl3soSGoGMyi',
    name: '9 Apps All-in-one Design Pack',
    description: 'Lifetime access to all DesignActiv tools',
    price: 49.00,
    currency: 'usd',
    currencySymbol: '$',
    mode: 'payment'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};