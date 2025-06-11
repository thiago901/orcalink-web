import { loadStripe } from "@stripe/stripe-js";
import api from "../../api/axios";
import { Button, ButtonProps } from "@heroui/react";
import { createCustomer } from "../../api/payments";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // pegue no dashboard

interface CheckoutButtonProps extends ButtonProps {
  email: string;
  priceId: string;
}

export function CheckoutButton({
  email,
  priceId,
  ...rest
}: CheckoutButtonProps) {
  const handleClick = async () => {
  
    const customer = await createCustomer({email});
    
    
    
    const checkoutRes = await api.post("/payments/session", {
      customer_id: customer.id,
      price_id: priceId,
    });

    const stripe = await stripePromise;
    console.log("stripe", stripe);
    console.log("checkoutRes", checkoutRes.data);

    window.location.href = checkoutRes.data.result; // redireciona para o checkout
  };

  return (
    <Button {...rest} onPress={handleClick}>
      Assinar plano
    </Button>
  );
}
