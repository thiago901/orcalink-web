
import { useAuthStore } from "../stores/authStore";

import { Button, Link } from "@heroui/react";
import { FaBuilding, FaClipboardList, FaShield } from "react-icons/fa6";
import { FiBarChart } from "react-icons/fi";


const HomePage = () => {
  const { isAuthenticated } = useAuthStore();
  

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">
            Conectando você aos melhores profissionais
          </h1>
          <p className="text-lg max-w-3xl mx-auto">
            Nossa plataforma conecta clientes a profissionais de confiança. Você
            envia um pedido de orçamento, recebe propostas iniciais e escolhe a
            melhor. Depois disso, o profissional agenda uma visita para seguir
            com o serviço diretamente com você.
          </p>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Como funciona
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <FaClipboardList className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Solicite um orçamento
              </h3>
              <p className="text-neutral-600">
                Informe o tipo de serviço, detalhes e fotos. Seu pedido será
                enviado para todos os profissionais da sua região.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <FaBuilding className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Receba propostas</h3>
              <p className="text-neutral-600">
                Profissionais disponíveis analisam seu pedido e enviam propostas
                iniciais. Você pode comparar e escolher.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <FaShield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Agende com confiança
              </h3>
              <p className="text-neutral-600">
                Ao aceitar uma proposta, o profissional agenda uma visita para
                conversar, avaliar e dar continuidade ao serviço.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <FiBarChart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Acompanhe sua reputação
              </h3>
              <p className="text-neutral-600">
                Veja avaliações reais de clientes anteriores e contrate com
                segurança e transparência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para encontrar o profissional ideal?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-neutral-600">
            Solicite orçamentos de forma simples, rápida e segura. Tudo em um só
            lugar, com profissionais confiáveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Acessar painel
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button
                    size="lg"
                    color="primary"
                    className="w-full sm:w-auto"
                  >
                    Criar uma conta
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Entrar na plataforma
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
