import { loadStripe } from "@stripe/stripe-js";
import api from "../../api/axios";
import { Button, ButtonProps } from "@heroui/react";

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
    // const customerRes = await fetch('/api/stripe/create-customer', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    // });
    // const { id: customerId } = await customerRes.json();

    const checkoutRes = await api.post("/payments/session", {
      customer_id: "cus_ST8ZBT5Q33gHVO",
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
