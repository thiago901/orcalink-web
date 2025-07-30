import { loadStripe } from "@stripe/stripe-js";

import { Button, ButtonProps } from "@heroui/react";
import { createCustomerSession } from "../../api/payments";

interface CheckoutButtonProps extends ButtonProps {
  proposal_id: string;
}

export function CheckoutButton({
  proposal_id,

  ...rest
}: CheckoutButtonProps) {
  const handleClick = async () => {
    const checkoutRes = await createCustomerSession({ proposal_id });

    await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

    
    window.open(checkoutRes.session_url, '_blank');
  };

  return (
    <Button {...rest} onPress={handleClick}>
      Pagar agora
      
    </Button>
  );
}
