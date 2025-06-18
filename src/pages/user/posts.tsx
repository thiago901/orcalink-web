import { Avatar, Button, Card, CardBody, CardHeader, Chip, Input, Link, Select, SelectItem } from '@heroui/react';
import { Text } from "../../components/ui/Text";


import {v4} from 'uuid'
import ImageGallery from "../../components/image-gallery";
import { Subtitle } from "../../components/ui/Subtitle";
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { CiMapPin, CiSearch } from 'react-icons/ci';
import { MdVerified } from 'react-icons/md';

const posts  = [
    {
      url: 'https://i.pravatar.cc/300?img=1',
      company_name: 'TintaFácil',
      company_verified: true,
      post_text: 'Aplicação de grafiato na sala de estar com acabamento premium. Cliente satisfeito e ambiente renovado!',
      created_at: new Date('2025-05-10T14:30:00'),
      images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201+i)}`}))
    },
    {
      url: 'https://i.pravatar.cc/300?img=2',
      company_name: 'PintArt Pro',
      company_verified: true,
      post_text: 'Fachada renovada com pintura emborrachada resistente ao tempo. Ideal para regiões com muita chuva.',
      created_at: new Date('2025-05-09T09:10:00'),
      images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201+i)}`}))
    },
    {
      url: 'https://i.pravatar.cc/300?img=3',
      company_name: 'Mãos à Obra',
      company_verified: false,
      post_text: 'Reforma completa do quarto com pintura e instalação de drywall. Cliente amou o novo espaço!',
      created_at: new Date('2025-05-08T16:45:00'),
      images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201+i)}`}))
    },
    {
      url: 'https://i.pravatar.cc/300?img=4',
      company_name: 'ColorMix Serviços',
      company_verified: true,
      post_text: 'Pintura decorativa em corredor de entrada com textura espatulada. Destaque e elegância!',
      created_at: new Date('2025-05-07T12:20:00'),
      images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201+i)}`}))
    },
    {
      url: 'https://i.pravatar.cc/300?img=5',
      company_name: 'Obra Certa',
      company_verified: false,
      post_text: 'Pintura externa de casa térrea com tinta acrílica fosca. Proteção e beleza!',
      created_at: new Date('2025-05-06T10:05:00'),
      images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201+i)}`}))
    },
    {
      url: 'https://i.pravatar.cc/300?img=6',
      company_name: 'Acabamento Ideal',
      company_verified: true,
      post_text: 'Aplicação de grafiato em parede da área gourmet. Resultado incrível e moderno!',
      created_at: new Date('2025-05-05T18:30:00'),
      images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201+i)}`}))
    },
    {
      url: 'https://i.pravatar.cc/300?img=7',
      company_name: 'Nova Cor Pinturas',
      company_verified: true,
      post_text: 'Pintura de teto com tinta anti-mofo em banheiro. Prevenção e durabilidade garantidas.',
      created_at: new Date('2025-05-04T08:40:00'),
      images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201+i)}`}))
    },
    {
      url: 'https://i.pravatar.cc/300?img=8',
      company_name: 'DecorExpress',
      company_verified: false,
      post_text: 'Revestimento com cimento queimado na parede da sala. Estilo industrial moderno!',
      created_at: new Date('2025-05-03T15:00:00'),
      images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201+i)}`}))
    },
    {
      url: 'https://i.pravatar.cc/300?img=9',
      company_name: 'Pintou Legal',
      company_verified: true,
      post_text: 'Pintura de portão com tinta esmalte sintético fosco. Alta durabilidade e ótimo acabamento.',
      created_at: new Date('2025-05-02T13:25:00'),
      images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201+i)}`}))
    },
    {
      url: 'https://i.pravatar.cc/300?img=10',
      company_name: 'Top Revest',
      company_verified: true,
      post_text: 'Grafiato em fachada de sobrado com aplicação em dois dias. Cliente feliz e visual top!',
      created_at: new Date('2025-05-01T11:00:00'),
      images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201+i)}`}))
    }
  ];
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
  
export function Posts(){
 const [searchParams, setSearchParams] = useState({
    category: '',
    location: '',
    sort: 'newest',
  });
const { isAuthenticated } = useAuthStore();

    return (

        <>
          {/* Header/Navigation */}
              <header className="bg-white shadow-sm border-b border-neutral-200">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold text-primary-700">OrçaLink</h1>
                  </div>
                  <div className="space-x-4">
                    {isAuthenticated ? (
                      
                        <Button as={Link} href="/comoany">Minha Conta</Button>
                      
                    ) : (
                      <>
                        
                          <Button as={Link}variant="ghost" href="/login">Entrar</Button>
                        
                        
                          <Button as={Link} color="primary" href="/register">Cadastrar</Button>
                        
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
                        startContent={<CiMapPin size={18} />}
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
                        startContent={<CiSearch size={20} />}
                      >
                        Buscar Serviços
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
        <div className=" max-w-4xl mx-auto flex flex-col gap-2">
               
            {posts.map(post=>
                <Card className="">
                    <CardHeader>
                        <Avatar size="lg" src={post.url} />
                        <div className="flex ml-2">
                            <Subtitle>{post.company_name}</Subtitle>
                            <Text>{post.company_verified && <MdVerified/>}</Text>
                        </div>
                
                    </CardHeader>
                    <CardBody className="pt-0">
                        <Text className="py-2">{post.post_text}</Text>
                        <div className="py-2 flex gap-1">
                            <Chip radius='sm'>{CATEGORIES[0].label}</Chip>
                            <Chip radius='sm'>{CATEGORIES[1].label}</Chip>
                            <Chip radius='sm'>{CATEGORIES[2].label}</Chip>
                            <Chip radius='sm'>{CATEGORIES[3].label}</Chip>
                            
                        </div>
                        <ImageGallery images={post.images||[]} layout="carousel"/>

                    </CardBody>
                    
                </Card>
            )}
            
        </div>
    </>
    )
}