import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Link,
  Select,
  SelectItem,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { getCompanies } from "../../api/companies";
import { getCategories } from "../../api/category";
import { CiBookmark, CiStar } from "react-icons/ci";

export function Partners() {
  const [categoriesSelected, setCategoriesSelected] = useState<Set<string>>(
    new Set([])
  );

  const { data: companies } = useQuery({
    queryKey: ["companies", Array.from(categoriesSelected)],
    queryFn: () => getCompanies({ categories: Array.from(categoriesSelected) }),
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const handleSelectionChange = useCallback((keys: "all" | Set<React.Key>) => {
    if (keys === "all") return;
    setCategoriesSelected(new Set([...keys].map(String)));
  }, []);

  const toggleCategory = (name: string) => {
    const newSet = new Set(categoriesSelected);
    if (newSet.has(name)) {
      newSet.delete(name);
    } else {
      newSet.add(name);
    }
    setCategoriesSelected(newSet);
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Conheça nossos parceiros
            </h2>
            <p className="text-lg opacity-90">
              Veja quem são os profissionais que fazem parte da nossa rede
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col p-6">
    

        {/* Filtros rápidos */}
        {/* Filtro de categorias */}
        {categories && (
          <div className="w-full max-w-6xl mx-auto px-4 py-4">
            {/* Chips como filtros visuais principais */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => {
                const isSelected = categoriesSelected.has(cat.name);
                return (
                  <Chip
                    key={cat.name}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white text-neutral-800 border border-neutral-300"
                    }`}
                    onClick={() => toggleCategory(cat.name)}
                    variant="flat"
                    size="md"
                  >
                    {cat.name}
                  </Chip>
                );
              })}
            </div>

            {/* Select visível apenas se quiser um modo alternativo (ex: para muitos itens ou mobile) */}
            <div className="hidden">
              <Select
                selectedKeys={categoriesSelected}
                onSelectionChange={handleSelectionChange}
                selectionMode="multiple"
                label="Categoria"
                placeholder="Selecione uma categoria"
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.name}>{cat.name}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-6 max-w-6xl mx-auto">
          {companies?.map((company, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-md group rounded-2xl border"
            >
              <div className="relative">
                <img
                  src={company.avatar}
                  alt={company.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full shadow">
                  <CiBookmark className="w-4 h-4 text-neutral-700" />
                </button>
              </div>

              <CardBody className="p-4">
                <h3 className="text-base font-semibold text-neutral-900 mb-1">
                  {company.name}
                </h3>

                <p className="text-sm text-neutral-600 line-clamp-3">
                  {company.about?.slice(0, 300)}
                </p>

                <div className="flex gap-1 flex-wrap mt-4">
                  {company.services.map((service) => (
                    <Chip key={service.name} size="sm" variant="bordered">
                      {service.name}
                    </Chip>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-neutral-600">
                    {company.address.city}, {company.address.country}
                  </p>
                  <div className="flex items-center text-sm text-neutral-500">
                    <CiStar className="w-4 h-4 mr-1 text-yellow-500" />
                    {company.ratting ?? "—"}
                  </div>
                </div>
              </CardBody>

              <CardFooter className="px-4 pb-4">
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
    </div>
  );
}
