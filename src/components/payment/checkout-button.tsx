import { loadStripe } from '@stripe/stripe-js';
import api from '../../api/axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // pegue no dashboard

interface CheckoutButtonProps {
  email: string;
  priceId: string;
}

export function CheckoutButton({ email, priceId }: CheckoutButtonProps) {
  const handleClick = async () => {
    // const customerRes = await fetch('/api/stripe/create-customer', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    // });
    // const { id: customerId } = await customerRes.json();

    const checkoutRes = await api.post('/payments/session', {
      
        customer_id:'cus_ST8ZBT5Q33gHVO', price_id:priceId 
    });
    

    const stripe = await stripePromise;
    console.log('stripe',stripe);
    console.log('checkoutRes',checkoutRes.data);
    
    window.location.href = checkoutRes.data.result; // redireciona para o checkout
  };

  return (
    <button onClick={handleClick} className="bg-blue-600 text-white p-3 rounded">
      Assinar plano
    </button>
  );
}
