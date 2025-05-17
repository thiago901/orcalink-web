


import { Avatar, Card, CardBody, CardFooter, CardHeader, Chip, Tab, Tabs } from '@heroui/react';
import {v4} from 'uuid'
import { Building2, Clock3, Info, Mail, MapPin, Phone, ShieldCheck, Verified } from 'lucide-react';
import { Subtitle } from '../../components/ui/Subtitle';
import { Text } from '../../components/ui/Text';
import ImageGallery from '../../components/image-gallery';
import { StarRating } from '../../components/star-rating';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { SmallText } from '../../components/ui/SmallText';
import { Title } from '../../components/ui/Title';
const profile ={
  verified:true,
  avatar:'https://i.pravatar.cc/300?img=15',
  "average_time": "5 minutos",
  name:"Pinturas MJ",
  skils:['PINTURA',"Marceneiro"],
  phone:"5511940260283",
  email:"tsrocha901@gmail.com",
  address:{
    street:"Rua 123456",
    state:"SP",
    city:"São Paulo",
    zip:"05846-050"
  }
}
const reviews =[
  {
    title:"Professional and responsive",
    review:4.8,
    description:"We hired ProCompany for our e-commerce platform development, and they were professional from start to finish. Their team was responsive to our needs and delivered a solution that has transformed our online business.",
    autor:{
      avatar:'https://i.pravatar.cc/300?img=1',
      name:'Ariane L A Rocha',
      created_at: new Date()
    }
  }
]
const posts  = [
  {
    url: 'https://i.pravatar.cc/300?img=1',
    company_name: 'TintaFácil',
    company_verified: true,
    post_text: 'Aplicação de grafiato na sala de estar com acabamento premium. Cliente satisfeito e ambiente renovado!',
    created_at: new Date('2025-05-10T14:30:00'),
    images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201)}`}))
  },
  {
    url: 'https://i.pravatar.cc/300?img=2',
    company_name: 'PintArt Pro',
    company_verified: true,
    post_text: 'Fachada renovada com pintura emborrachada resistente ao tempo. Ideal para regiões com muita chuva.',
    created_at: new Date('2025-05-09T09:10:00'),
    images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201)}`}))
  },
  {
    url: 'https://i.pravatar.cc/300?img=3',
    company_name: 'Mãos à Obra',
    company_verified: false,
    post_text: 'Reforma completa do quarto com pintura e instalação de drywall. Cliente amou o novo espaço!',
    created_at: new Date('2025-05-08T16:45:00'),
    images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201)}`}))
  },
  {
    url: 'https://i.pravatar.cc/300?img=4',
    company_name: 'ColorMix Serviços',
    company_verified: true,
    post_text: 'Pintura decorativa em corredor de entrada com textura espatulada. Destaque e elegância!',
    created_at: new Date('2025-05-07T12:20:00'),
    images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201)}`}))
  },
  {
    url: 'https://i.pravatar.cc/300?img=5',
    company_name: 'Obra Certa',
    company_verified: false,
    post_text: 'Pintura externa de casa térrea com tinta acrílica fosca. Proteção e beleza!',
    created_at: new Date('2025-05-06T10:05:00'),
    images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201)}`}))
  },
  {
    url: 'https://i.pravatar.cc/300?img=6',
    company_name: 'Acabamento Ideal',
    company_verified: true,
    post_text: 'Aplicação de grafiato em parede da área gourmet. Resultado incrível e moderno!',
    created_at: new Date('2025-05-05T18:30:00'),
    images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201)}`}))
  },
  {
    url: 'https://i.pravatar.cc/300?img=7',
    company_name: 'Nova Cor Pinturas',
    company_verified: true,
    post_text: 'Pintura de teto com tinta anti-mofo em banheiro. Prevenção e durabilidade garantidas.',
    created_at: new Date('2025-05-04T08:40:00'),
    images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201)}`}))
  },
  {
    url: 'https://i.pravatar.cc/300?img=8',
    company_name: 'DecorExpress',
    company_verified: false,
    post_text: 'Revestimento com cimento queimado na parede da sala. Estilo industrial moderno!',
    created_at: new Date('2025-05-03T15:00:00'),
    images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201)}`}))
  },
  {
    url: 'https://i.pravatar.cc/300?img=9',
    company_name: 'Pintou Legal',
    company_verified: true,
    post_text: 'Pintura de portão com tinta esmalte sintético fosco. Alta durabilidade e ótimo acabamento.',
    created_at: new Date('2025-05-02T13:25:00'),
    images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201)}`}))
  },
  {
    url: 'https://i.pravatar.cc/300?img=10',
    company_name: 'Top Revest',
    company_verified: true,
    post_text: 'Grafiato em fachada de sobrado com aplicação em dois dias. Cliente feliz e visual top!',
    created_at: new Date('2025-05-01T11:00:00'),
    images: [1,2,3,4].map(i=>({id:v4(),url:`http://placebear.com/250/${ Math.floor(Math.random() * 201)}`}))
  }
];
const CATEGORIES = [
  { key: 'painting', label: 'Pintura' },
  { key: 'electrical', label: 'Elétrica' },
  { key: 'plumbing', label: 'Hidráulica' },
  { key: 'construction', label: 'Construção' },
];
export const Companies = () => {
  return (
    <div className='flex flex-col gap-2'>
      <Card>
        <CardHeader>
          <Avatar src={profile.avatar} size='lg'/>
          <div className='flex'>
            <Subtitle>{profile.name}</Subtitle>
            
          </div>
          <Verified/>
        </CardHeader>
      </Card>

     <Tabs>
     <Tab title="Sobre">
  <div className="">
    
    {/* Título principal */}
 

    {/* Grid de informações principais */}
    <div className="flex flex-col gap-4">
      <Card className="flex items-start gap-4">
        <CardBody className='space-y-4'>
          <div>
            <div className='flex items-center gap-2'>
              <Building2 className="w-6 h-6 text-blue-500 mt-1" />
              <p className="text-sm text-zinc-500">Nome da empresa</p>
            </div>
            <div>
              
              <Subtitle>Pintura Pro Ltda</Subtitle>
            </div>
          </div>

          <div>
            <div className='flex items-center gap-2'>
              <Info className="w-6 h-6 text-emerald-500 mt-1" />
              <p className="text-sm text-zinc-500">Quem somos</p>
            </div>
            <div>
              <Text>
                Atuamos há mais de 12 anos com pintura residencial e comercial, oferecendo soluções de alto padrão com garantia e agilidade.
              </Text>
            </div>
          </div>
        </CardBody>
      </Card>

     

     <Card>
      <CardBody>
        <div className="flex items-start gap-4">
          <MapPin className="w-6 h-6 text-pink-500 mt-1" />
          <div>
            <SmallText >Endereço</SmallText>
            <Text>
              Rua das Cores, 789 – Bairro Central, São Paulo - SP
            </Text>
          </div>
        </div>

        <div>
          <Text>Contato</Text>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-500" />
              <Text>+55 (11) 91234-5678</Text>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-cyan-500" />
              <Text>contato@pinturapro.com.br</Text>
            </div>
          </div>
        </div>
      </CardBody>
     </Card>

      <Card>
        <CardBody>
          <div className="flex items-start gap-4">
            <Clock3 className="w-6 h-6 text-orange-500 mt-1" />
            <div>
              <SmallText>Tempo médio de análise de orçamentos</SmallText>
              <Text>1h 30min</Text>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>


  </div>
</Tab>

      <Tab title="Postagens" >
        <Card>
    
          {posts.map(post=>
                  <Card className="">
                      <CardHeader>
                          <Avatar size="lg" src={post.url} />
                          <div className="flex ml-2">
                              <Subtitle>{post.company_name}</Subtitle>
                              <Text>{post.company_verified && <ShieldCheck/>}</Text>
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
        </Card>
      </Tab>
      <Tab title="Avaliações">
          {reviews.map(r=>
            <Card className=''>
              
              <CardHeader className='space-x-2'>
                <Avatar src={r.autor.avatar} size='md'/>
                <Text className='font-semibold'>{r.autor.name}</Text>
                
                <StarRating rating={r.review}/>
              </CardHeader>
              
              
              <CardBody className='flex flex-col gap-2'>
                <Subtitle>{r.title}</Subtitle>
                <Text>{r.description}</Text>
              </CardBody>
              <CardFooter>
              <SmallText>{format(r.autor.created_at,"dd 'de' MMMM 'de' yyyy",{locale:pt})}</SmallText>
              </CardFooter>
            </Card>
          )}
      </Tab>
     </Tabs>
    </div>
)
 
};

