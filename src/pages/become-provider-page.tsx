import { Card, CardBody, Button } from "@heroui/react";
import { FiTrendingUp, FiSettings, FiShield, FiCheckCircle } from "react-icons/fi";

export function BecomeProviderPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Torne-se um Prestador na OrçaLink</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Aumente suas oportunidades, potencialize seus ganhos e conquiste novos clientes com total segurança.
          </p>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Vantagens de ser um Prestador</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardBody className="flex flex-col items-center">
                <FiTrendingUp className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Potencialize seu Negócio</h3>
                <p className="text-neutral-600">
                  Aumente o volume de serviços prestados e amplie sua carteira de clientes na sua região.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col items-center">
                <FiSettings className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Gestão Facilitada</h3>
                <p className="text-neutral-600">
                  Tenha acesso a um dashboard completo para gerenciar seus ganhos e enviar orçamentos personalizados.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col items-center">
                <FiShield className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Garantia de Recebimento</h3>
                <p className="text-neutral-600">
                  O pagamento do serviço é garantido através do OrçaLink, com segurança para ambas as partes.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col items-center">
                <FiCheckCircle className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Reputação e Confiança</h3>
                <p className="text-neutral-600">
                  Construa sua reputação através de avaliações positivas e se destaque frente aos concorrentes.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para ser um prestador?</h2>
          <p className="text-lg max-w-2xl mx-auto text-neutral-600 mb-8">
            Cadastre-se agora e comece a aproveitar todas as vantagens de ser um prestador parceiro da OrçaLink.
          </p>
          <Button as="a" href="/register" color="primary" size="lg">
            Quero ser um Prestador
          </Button>
        </div>
      </section>
    </div>
  );
}

export default BecomeProviderPage;
