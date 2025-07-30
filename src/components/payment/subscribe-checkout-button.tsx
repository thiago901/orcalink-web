import { loadStripe } from "@stripe/stripe-js";
import api from "../../api/axios";
import { Button, ButtonProps } from "@heroui/react";
import { createCustomer } from "../../api/payments";

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
    const customer = await createCustomer({ email });

    const checkoutRes = await api.post("/payments/session", {
      customer_id: customer.id,
      price_id: priceId,
    });

    await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

    window.location.href = checkoutRes.data.result; // redireciona para o checkout
  };

  return (
    <Button {...rest} onPress={handleClick}>
      Assinar plano
    </Button>
  );
}
