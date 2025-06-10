import { Image, Link } from "@heroui/react";

export function Success() {
  return (
    <div className="flex flex-col items-center p-6 text-center">
      <Image src="/public/ilustrations/payment.png" />
      <h1 className="text-2xl font-bold text-green-600">
        Pagamento confirmado!
      </h1>
      <p className="mt-4">Obrigado por sua assinatura 🎉</p>
      <Link href="/">Voltar à tela inicial</Link>
    </div>
  );
}
