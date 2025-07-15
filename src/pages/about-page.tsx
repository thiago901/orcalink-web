import { Card, CardBody, CardHeader } from "@heroui/react";
import { FiUsers, FiTarget, FiAward, FiBookOpen } from "react-icons/fi";

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Sobre a OrçaLink</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Uma plataforma criada para transformar a forma como clientes e
            prestadores de serviço se conectam, com foco em qualidade, segurança
            e profissionalismo.
          </p>
        </div>
      </section>

      <section className="">
        <Card className="h-80 py-16 bg-gray-50">
          <CardBody>
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
              <p className="max-w-3xl mx-auto text-neutral-600">
                A OrçaLink nasceu da iniciativa de um jovem empreendedor que, ao
                perceber as dificuldades na contratação de serviços, criou uma
                plataforma que oferece segurança tanto para o cliente quanto
                para o prestador.
              </p>
            </div>
          </CardBody>
        </Card>
      </section>

      <section>
        <Card className="py-16" radius="none" shadow="none">
          <CardBody>
            <h2 className="text-3xl font-bold text-center mb-12">
              Missão, Visão e Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <FiTarget className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Missão</h3>
                <p className="text-neutral-600">
                  Fazer com que o serviço do cliente seja prestado com
                  qualidade, confiabilidade e tranquilidade.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <FiAward className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Visão</h3>
                <p className="text-neutral-600">
                  Ser uma das maiores intermediadoras de serviços de São Paulo.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <FiBookOpen className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Valores</h3>
                <p>Ética, Respeito, Profissionalismo, Integridade</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Como Funciona */}
      <section>
        <Card className="py-16  bg-gray-50" radius="none" shadow="none">
          <CardBody>
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Como Funciona</h2>
              <p className="max-w-3xl mx-auto mb-8 text-neutral-600">
                Conectamos quem precisa com quem sabe fazer!
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <div className="text-center w-full">
                      <h3 className="text-xl font-semibold">
                        Para Cliente
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <p className="text-neutral-600 text-center pb-4">
                      Pelo nosso site, você escolhe o serviço desejado, descreve
                      o que precisa e os profissionais entram em contato para
                      enviar os orçamentos.
                    </p>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="text-center w-full">
                      <h3 className="text-xl font-semibold">
                        Para Profissional
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <p className="text-neutral-600 text-center pb-4">
                      Pelo app, você visualiza oportunidades de clientes na sua
                      região e escolhe quais quer atender, com segurança de que
                      o serviço prestado será pago.
                    </p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Fale Conosco */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <FiUsers className="h-12 w-12 text-brand-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Fale Conosco</h2>
          <p className="text-lg max-w-2xl mx-auto text-neutral-600 mb-6">
            Quer saber mais sobre nós ou tem alguma dúvida? Estamos sempre
            disponíveis para te ajudar.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded font-medium hover:bg-primary-700 transition"
          >
            Entrar em Contato
          </a>
        </div>
      </section>
    </div>
  );
}
