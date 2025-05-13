import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Building2, ClipboardList, ShieldCheck, BarChart, Search, MapPin, Star, Filter } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from '@heroui/react';

const CATEGORIES = [
  { key: 'painting', label: 'Pintura' },
  { key: 'electrical', label: 'Elétrica' },
  { key: 'plumbing', label: 'Hidráulica' },
  { key: 'construction', label: 'Construção' },
];

const LOCATIONS = [
  { key: 'indoor', label: 'Ambiente Interno' },
  { key: 'outdoor', label: 'Ambiente Externo' },
];

const SORT_OPTIONS = [
  { key: 'newest', label: 'Mais Recentes' },
  { key: 'rating', label: 'Melhor Avaliados' },
  { key: 'distance', label: 'Mais Próximos' },
];

const FEATURED_SERVICES = [
  {
    id: '1',
    title: 'Pintura Residencial Profissional',
    description: 'Serviço completo de pintura com acabamento premium e garantia de 2 anos. Atendemos toda região metropolitana.',
    company: 'PinturasPro LTDA',
    isVerified: true,
    rating: 4.8,
    tags: ['Pintura', 'Residencial', 'Premium'],
    image: 'https://images.pexels.com/photos/8005397/pexels-photo-8005397.jpeg',
  },
  {
    id: '2',
    title: 'Instalação e Manutenção Elétrica',
    description: 'Serviços elétricos residenciais e comerciais. Profissionais certificados e material de primeira linha.',
    company: 'Eletrotec Serviços',
    isVerified: true,
    rating: 4.9,
    tags: ['Elétrica', 'Manutenção', '24h'],
    image: 'https://images.pexels.com/photos/8005415/pexels-photo-8005415.jpeg',
  },
  {
    id: '3',
    title: 'Reforma Completa de Banheiros',
    description: 'Transforme seu banheiro com nossa equipe especializada. Projetos personalizados e execução impecável.',
    company: 'Reformas Express',
    isVerified: false,
    rating: 4.7,
    tags: ['Reforma', 'Banheiro', 'Design'],
    image: 'https://images.pexels.com/photos/8005425/pexels-photo-8005425.jpeg',
  },
];

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();
  const [searchParams, setSearchParams] = useState({
    category: '',
    location: '',
    sort: 'newest',
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-700">OrçaFacil</h1>
          </div>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Minha Conta</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button color="primary">Cadastrar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white mb-8">
            <h2 className="text-4xl font-bold mb-4">Encontre o Serviço Ideal</h2>
            <p className="text-lg opacity-90">Compare orçamentos e encontre os melhores profissionais da sua região</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Select 
                label="Categoria"
                placeholder="Selecione uma categoria"
                value={searchParams.category}
                onChange={(value) => setSearchParams(prev => ({ ...prev, category: value }))}
              >
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.key} value={cat.key}>{cat.label}</SelectItem>
                ))}
              </Select>

              <Select
                label="Localização"
                placeholder="Tipo de ambiente"
                value={searchParams.location}
                onChange={(value) => setSearchParams(prev => ({ ...prev, location: value }))}
              >
                {LOCATIONS.map(loc => (
                  <SelectItem key={loc.key} value={loc.key}>{loc.label}</SelectItem>
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
                onChange={(value) => setSearchParams(prev => ({ ...prev, sort: value }))}
              >
                {SORT_OPTIONS.map(opt => (
                  <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                color="primary"
                size="lg"
                startContent={<Search size={20} />}
              >
                Buscar Serviços
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">Serviços em Destaque</h3>
            <Button
              variant="ghost"
              startContent={<Filter size={18} />}
            >
              Filtrar
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_SERVICES.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <CardBody className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{service.title}</h4>
                      <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-medium">{service.company}</span>
                    {service.isVerified && (
                      <ShieldCheck size={16} className="text-primary-600" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center text-yellow-400">
                      <Star size={16} fill="currentColor" />
                      <span className="ml-1 text-sm font-medium">{service.rating}</span>
                    </div>
                    <div className="flex gap-2">
                      {service.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      as={Link}
                      to={`/services/${service.id}`}
                      color="primary"
                      className="flex-1"
                    >
                      Ver Detalhes
                    </Button>
                    <Button
                      as={Link}
                      to={`/companies/${service.id}`}
                      variant="ghost"
                      className="flex-1"
                    >
                      Perfil da Empresa
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              size="lg"
              variant="ghost"
              as={Link}
              to="/services"
            >
              Ver Todos os Serviços
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Solicite orçamentos</h3>
              <p className="text-neutral-600">
                Descreva seu projeto e receba múltiplas propostas de profissionais qualificados.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compare propostas</h3>
              <p className="text-neutral-600">
                Analise orçamentos, veja avaliações e escolha o melhor profissional para seu projeto.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contrate com segurança</h3>
              <p className="text-neutral-600">
                Profissionais verificados e sistema de avaliações para garantir qualidade no serviço.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <BarChart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Economize tempo e dinheiro</h3>
              <p className="text-neutral-600">
                Compare preços, qualidade e prazos em um só lugar, sem complicações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-neutral-600">
            Junte-se a milhares de usuários que já estão economizando tempo e dinheiro com o OrçaFacil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                color="primary"
                className="w-full sm:w-auto"
              >
                Criar uma conta
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="w-full sm:w-auto"
                >
                  Acessar painel
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="w-full sm:w-auto"
                >
                  Entrar na plataforma
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">OrçaFacil</h3>
              <p className="text-neutral-400">
                A melhor plataforma para encontrar profissionais qualificados para o seu projeto.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Clientes</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white">Como funciona</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Solicitar orçamento</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Avaliações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Empresas</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white">Como participar</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Criar perfil</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Enviar propostas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2">
                <li className="text-neutral-400">contato@orcafacil.com</li>
                <li className="text-neutral-400">(11) 99999-9999</li>
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="text-neutral-400 hover:text-white">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-neutral-400 hover:text-white">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-neutral-400 hover:text-white">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-700 text-center text-neutral-400">
            <p>© 2025 OrçaFacil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;