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
    id: 'prod_UPl7uD8rMKkhhv',
    priceId: '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',
    name: '9 Apps All-in-one Design Pack',
    description: 'Lifetime access to all DesignActiv design tools',
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