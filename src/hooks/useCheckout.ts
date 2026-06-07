import { useNavigate } from 'react-router-dom';

export function useCheckout() {
  const navigate = useNavigate();

  const createCheckoutSession = async (_priceId: string) => {
    navigate('/checkout');
  };

  return {
    createCheckoutSession,
    isLoading: false,
  };
}
