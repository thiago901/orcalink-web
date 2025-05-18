import { Bookmark, MapPin, Search, Star } from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Input,
  Link,
  Select,
  SelectItem,
} from "@heroui/react";
import { getCompanies } from "../../api/companies";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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

export function Partners() {
  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompanies(),
  });
  const [searchParams, setSearchParams] = useState({
    category: "",
    location: "",
    sort: "newest",
  });

  return (
    <div className="">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Encontre o Serviço Ideal
            </h2>
            <p className="text-lg opacity-90">
              Compare orçamentos e encontre os melhores profissionais da sua
              região
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
                label="Localização"
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
                Buscar Serviços
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-6 max-w-6xl mx-auto">
        {companies?.map((company, index) => (
          <Card key={index} className="p-0 overflow-hidden shadow-md group">
            <div className="relative">
              <img
                src={company.avatar}
                alt={company.name}
                className="w-full h-48 object-cover"
              />
              <button className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full shadow">
                <Bookmark className="w-4 h-4 text-neutral-700" />
              </button>
            </div>

            <CardBody className="p-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                {company.name}
              </h3>

              <p className="text-sm text-neutral-600">{company.about?.slice(0,300)}</p>

              <p className="text-xs text-neutral-400 mt-2">
                <div className="flex gap-1">
                  {company.services.map((service) => (
                    <Chip>{service.name}</Chip>
                  ))}
                </div>
              </p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-neutral-600">
                  {company.address.city}, {company.address.country}
                </p>
                <div className="flex items-center text-sm text-neutral-500 mt-3">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  {company.ratting}
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <Button
                as={Link}
                color="primary"
                size="sm"
                className="w-full"
                href={`/partners/${company.id}`}  
              >
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
