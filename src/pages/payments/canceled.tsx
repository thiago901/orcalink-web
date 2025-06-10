import { Image, Link } from "@heroui/react";

export function Canceled() {
  return (

    <div className="flex flex-col items-center p-6 text-center">
    <Image src="/public/ilustrations/canceled.png" />
    <h1 className="text-2xl font-bold text-red-600">Pagamento cancelado</h1>
    <p className="mt-4">Você pode tentar novamente quando quiser.</p>
    <Link href="/">Voltar à tela inicial</Link>
  </div>
);
  
}
