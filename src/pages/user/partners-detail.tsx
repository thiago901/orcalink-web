import { Avatar, Card, CardBody, Chip, Tab, Tabs } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "../../api/companies";
import { useParams } from "react-router-dom";
import { CiGlobe, CiMail, CiPhone } from "react-icons/ci";

// const posts = [
//   {
//     url: "https://i.pravatar.cc/300?img=1",
//     company_name: "TintaFácil",
//     company_verified: true,
//     post_text:
//       "Aplicação de grafiato na sala de estar com acabamento premium. Cliente satisfeito e ambiente renovado!",
//     created_at: new Date("2025-05-10T14:30:00"),
//     images: [1, 2, 3, 4].map((i) => ({
//       id: v4(),
//       url: `http://placebear.com/250/${Math.floor(Math.random() * 201)}`,
//     })),
//   },
//   {
//     url: "https://i.pravatar.cc/300?img=2",
//     company_name: "PintArt Pro",
//     company_verified: true,
//     post_text:
//       "Fachada renovada com pintura emborrachada resistente ao tempo. Ideal para regiões com muita chuva.",
//     created_at: new Date("2025-05-09T09:10:00"),
//     images: [1, 2, 3, 4].map((i) => ({
//       id: v4(),
//       url: `http://placebear.com/250/${Math.floor(Math.random() * 201)}`,
//     })),
//   },
//   {
//     url: "https://i.pravatar.cc/300?img=3",
//     company_name: "Mãos à Obra",
//     company_verified: false,
//     post_text:
//       "Reforma completa do quarto com pintura e instalação de drywall. Cliente amou o novo espaço!",
//     created_at: new Date("2025-05-08T16:45:00"),
//     images: [1, 2, 3, 4].map((i) => ({
//       id: v4(),
//       url: `http://placebear.com/250/${Math.floor(Math.random() * 201)}`,
//     })),
//   },
//   {
//     url: "https://i.pravatar.cc/300?img=4",
//     company_name: "ColorMix Serviços",
//     company_verified: true,
//     post_text:
//       "Pintura decorativa em corredor de entrada com textura espatulada. Destaque e elegância!",
//     created_at: new Date("2025-05-07T12:20:00"),
//     images: [1, 2, 3, 4].map((i) => ({
//       id: v4(),
//       url: `http://placebear.com/250/${Math.floor(Math.random() * 201)}`,
//     })),
//   },
//   {
//     url: "https://i.pravatar.cc/300?img=5",
//     company_name: "Obra Certa",
//     company_verified: false,
//     post_text:
//       "Pintura externa de casa térrea com tinta acrílica fosca. Proteção e beleza!",
//     created_at: new Date("2025-05-06T10:05:00"),
//     images: [1, 2, 3, 4].map((i) => ({
//       id: v4(),
//       url: `http://placebear.com/250/${Math.floor(Math.random() * 201)}`,
//     })),
//   },
//   {
//     url: "https://i.pravatar.cc/300?img=6",
//     company_name: "Acabamento Ideal",
//     company_verified: true,
//     post_text:
//       "Aplicação de grafiato em parede da área gourmet. Resultado incrível e moderno!",
//     created_at: new Date("2025-05-05T18:30:00"),
//     images: [1, 2, 3, 4].map((i) => ({
//       id: v4(),
//       url: `http://placebear.com/250/${Math.floor(Math.random() * 201)}`,
//     })),
//   },
//   {
//     url: "https://i.pravatar.cc/300?img=7",
//     company_name: "Nova Cor Pinturas",
//     company_verified: true,
//     post_text:
//       "Pintura de teto com tinta anti-mofo em banheiro. Prevenção e durabilidade garantidas.",
//     created_at: new Date("2025-05-04T08:40:00"),
//     images: [1, 2, 3, 4].map((i) => ({
//       id: v4(),
//       url: `http://placebear.com/250/${Math.floor(Math.random() * 201)}`,
//     })),
//   },
//   {
//     url: "https://i.pravatar.cc/300?img=8",
//     company_name: "DecorExpress",
//     company_verified: false,
//     post_text:
//       "Revestimento com cimento queimado na parede da sala. Estilo industrial moderno!",
//     created_at: new Date("2025-05-03T15:00:00"),
//     images: [1, 2, 3, 4].map((i) => ({
//       id: v4(),
//       url: `http://placebear.com/250/${Math.floor(Math.random() * 201)}`,
//     })),
//   },
//   {
//     url: "https://i.pravatar.cc/300?img=9",
//     company_name: "Pintou Legal",
//     company_verified: true,
//     post_text:
//       "Pintura de portão com tinta esmalte sintético fosco. Alta durabilidade e ótimo acabamento.",
//     created_at: new Date("2025-05-02T13:25:00"),
//     images: [1, 2, 3, 4].map((i) => ({
//       id: v4(),
//       url: `http://placebear.com/250/${Math.floor(Math.random() * 201)}`,
//     })),
//   },
//   {
//     url: "https://i.pravatar.cc/300?img=10",
//     company_name: "Top Revest",
//     company_verified: true,
//     post_text:
//       "Grafiato em fachada de sobrado com aplicação em dois dias. Cliente feliz e visual top!",
//     created_at: new Date("2025-05-01T11:00:00"),
//     images: [1, 2, 3, 4].map((i) => ({
//       id: v4(),
//       url: `http://placebear.com/250/${Math.floor(Math.random() * 201)}`,
//     })),
//   },
// ];
// const reviews = [
//   {
//     title: "Professional and responsive",
//     review: 4.8,
//     description:
//       "We hired ProCompany for our e-commerce platform development, and they were professional from start to finish. Their team was responsive to our needs and delivered a solution that has transformed our online business.",
//     autor: {
//       avatar: "https://i.pravatar.cc/300?img=1",
//       name: "Ariane L A Rocha",
//       created_at: new Date(),
//     },
//   },
// ];
// const CATEGORIES = [
//   { key: "painting", label: "Pintura" },
//   { key: "electrical", label: "Elétrica" },
//   { key: "plumbing", label: "Hidráulica" },
//   { key: "construction", label: "Construção" },
// ];
export function PartnersDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: () => getCompanyById(id!),
  });

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <Card className="w-full rounded-2xl shadow-md">
        <div>
          {company?.avatar && (
            <img
              src={company?.avatar}
              alt="Cover"
              className="h-32 w-full object-cover mb-[-50px]"
            />
          )}

          <div className=""></div>
        </div>

        <CardBody className="flex flex-col items-center">
          <Avatar
            src={company?.avatar}
            alt="Avatar"
            className="w-24 h-24 mb-4"
          />
          <p className="text-sm text-muted-foreground">Empresa</p>
          <h2 className="text-xl font-bold">{company?.name}</h2>
          <p className="text-sm text-muted-foreground mt-4">{company?.about}</p>
        </CardBody>
      </Card>
      <Card className="mt-4">
        <CardBody>
          <Tabs className="">
            <Tab title="Sobre">
              <div className="mt-6 text-left space-y-4">
                {company?.website && (
                  <div className="flex items-center gap-2">
                    <CiGlobe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{company?.website}</span>
                  </div>
                )}
                {company?.email && (
                  <div className="flex items-center gap-2">
                    <CiMail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{company.email}</span>
                  </div>
                )}
                {company?.phone && (
                  <div className="flex items-center gap-2">
                    <CiPhone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{company.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {company &&
                  company.services.map((service) => (
                    <Chip key={service.id}>{service.category_name}</Chip>
                  ))}
              </div>
            </Tab>
            {/* <Tab title="Trabalhos">
              {posts.map((post) => (
                <Card className="">
                  <CardHeader>
                    <Avatar
                      size="lg"
                      src={post.url}
                      name={company?.name.toLocaleUpperCase()}
                      showFallback
                    />
                    <div className="flex ml-2">
                      <Subtitle>{post.company_name}</Subtitle>
                      <Text>{post.company_verified && <ShieldCheck />}</Text>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <Text className="py-2">{post.post_text}</Text>
                    <div className="py-2 flex gap-1">
                      <Chip radius="sm">{CATEGORIES[0].label}</Chip>
                      <Chip radius="sm">{CATEGORIES[1].label}</Chip>
                      <Chip radius="sm">{CATEGORIES[2].label}</Chip>
                      <Chip radius="sm">{CATEGORIES[3].label}</Chip>
                    </div>
                    <ImageGallery
                      images={post.images || []}
                      layout="carousel"
                    />
                  </CardBody>
                </Card>
              ))}
            </Tab>
            <Tab title="Avaliações">
              {reviews.map((r) => (
                <Card className="">
                  <CardHeader className="space-x-2">
                    <Avatar src={r.autor.avatar} size="md" />
                    <Text className="font-semibold">{r.autor.name}</Text>

                    <StarRating rating={r.review} />
                  </CardHeader>

                  <CardBody className="flex flex-col gap-2">
                    <Subtitle>{r.title}</Subtitle>
                    <Text>{r.description}</Text>
                  </CardBody>
                  <CardFooter>
                    <SmallText>
                      {format(r.autor.created_at, "dd 'de' MMMM 'de' yyyy", {
                        locale: pt,
                      })}
                    </SmallText>
                  </CardFooter>
                </Card>
              ))}
            </Tab> */}
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
