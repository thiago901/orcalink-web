import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import {
  Building2,
  ClipboardList,
  ShieldCheck,
  BarChart,
  Search,
  MapPin,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

const CATEGORIES = [
  { key: "painting", label: "Pintura" },
  { key: "electrical", label: "Elétrica" },
  { key: "plumbing", label: "Hidráulica" },
  { key: "construction", label: "Construção" },
];

const LOCATIONS = [
  { key: "indoor", label: "Ambiente Interno" },
  { key: "outdoor", label: "Ambiente Externo" },
];

const SORT_OPTIONS = [
  { key: "newest", label: "Mais Recentes" },
  { key: "rating", label: "Melhor Avaliados" },
  { key: "distance", label: "Mais Próximos" },
];

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();
  const [searchParams, setSearchParams] = useState({
    category: "",
    location: "",
    sort: "newest",
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white text-center">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Como funciona
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-primary-600" />
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
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Receba propostas</h3>
              <p className="text-neutral-600">
                Profissionais disponíveis analisam seu pedido e enviam propostas
                iniciais. Você pode comparar e escolher.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-primary-600" />
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
                <BarChart className="w-8 h-8 text-primary-600" />
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

      {/* Formulário de Busca */}
      <section className="bg-neutral-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Faça seu pedido de orçamento
            </h2>
            <p className="text-neutral-600">
              Escolha a categoria, localização e forneça sua cidade.
              Profissionais disponíveis receberão seu pedido.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Select
                label="Categoria"
                placeholder="Selecione uma categoria"
                value={searchParams.category}
                onChange={(value) =>
                  setSearchParams((prev) => ({ ...prev, category: value }))
                }
              >
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.key} value={cat.key}>
                    {cat.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Ambiente"
                placeholder="Tipo de ambiente"
                value={searchParams.location}
                onChange={(value) =>
                  setSearchParams((prev) => ({ ...prev, location: value }))
                }
              >
                {LOCATIONS.map((loc) => (
                  <SelectItem key={loc.key} value={loc.key}>
                    {loc.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                type="text"
                label="Cidade"
                placeholder="Digite sua cidade"
                startContent={<MapPin size={18} />}
              />

              <Select
                label="Ordenar por"
                value={searchParams.sort}
                onChange={(value) =>
                  setSearchParams((prev) => ({ ...prev, sort: value }))
                }
              >
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.key} value={opt.key}>
                    {opt.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                color="primary"
                size="lg"
                startContent={<Search size={20} />}
              >
                Enviar Pedido de Orçamento
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para encontrar o profissional ideal?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-neutral-600">
            Solicite orçamentos de forma simples, rápida e segura. Tudo em um só
            lugar, com profissionais confiáveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" color="primary" className="w-full sm:w-auto">
                Criar uma conta
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Acessar painel
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Entrar na plataforma
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      <section className="py-10 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">
          Por que escolher nosso serviço?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-violet-500 text-3xl">💰</span>
            <h3 className="font-semibold mt-2">Preço Justo</h3>
            <p className="text-sm text-gray-500">
              Orçamentos sem compromisso e com ótimo custo-benefício.
            </p>
          </div>
          <div>
            <span className="text-violet-500 text-3xl">🎯</span>
            <h3 className="font-semibold mt-2">Pontualidade</h3>
            <p className="text-sm text-gray-500">
              Entregas dentro do prazo combinado, sem enrolação.
            </p>
          </div>
          <div>
            <span className="text-violet-500 text-3xl">🎨</span>
            <h3 className="font-semibold mt-2">Acabamento Profissional</h3>
            <p className="text-sm text-gray-500">
              Pintura bem feita, limpa e com qualidade garantida.
            </p>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-10 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">O que nossos clientes dizem</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <div className="bg-gray-900 p-4 rounded-xl shadow-md">
            <p className="italic text-sm text-gray-300">
              Ficamos impressionados com a qualidade da pintura e a atenção aos
              detalhes.
            </p>
            <p className="mt-2 font-semibold text-violet-400">
              — Ana Paula, São Paulo
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow-md">
            <p className="italic text-sm text-gray-300">
              Serviço rápido, limpo e com preço justo. Recomendo muito!
            </p>
            <p className="mt-2 font-semibold text-violet-400">
              — Rodrigo M., Campinas
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
