export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  currencySymbol: string;
  mode: 'payment' | 'subscription';
  checkoutUrl: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_UPl7uD8rMKkhhv',
    priceId: 'price_1TQvbhHfhBIMfl3suBOCxGSX',
    name: '9 Apps All-in-one Design Pack',
    description: 'Lifetime access to all DesignActiv design tools',
    price: 49.00,
    currency: 'usd',
    currencySymbol: '$',
    mode: 'payment',
    checkoutUrl: ''
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const formatPrice = (price: number, currencySymbol: string): string => {
  return `${currencySymbol}${price.toFixed(2)}`;
};