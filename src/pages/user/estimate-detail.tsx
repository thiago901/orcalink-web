import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  TableColumn,
  CardFooter,
} from "@heroui/react";
import { FiCalendar, FiUser } from "react-icons/fi";
import { Text } from "../../components/ui/Text";

import { formatCurrency } from "../../utils/format";

const estimate = {
  id: "b1b77332-5107-44b1-b0ba-c9ba402bcba6",
  company: {
    id: "d6830f95-1aa6-4369-90b7-9ca2ee1e0890",
    name: "Pinturas MJ",
    email: "tsrocha901@gmail.com",
    phone: "5511940260283",
    avatar:
      "https://storage.googleapis.com/teste-47675.appspot.com/orcafacil/dev/logopng-bf857297-0872-4333-a747-77a5cd5ed2aa.png",
    address: {
      _id: {
        value: "a298b42a-3b11-41d1-b3bc-8b73e2b25241",
      },
      props: {
        zip: "05846050",
        city: "São Paulo",
        name: "Pinturas MJ",
        state: "SP",
        address: "Rua Amâncio Pedro de Oliveira",
        country: "Brasil",
        latitude: -23.650258,
        longitude: -46.7474,
        created_at: "2025-06-19T14:50:46.263Z",
        updated_at: null,
      },
    },
    document: "fake_document",
  },
  company_id: "d6830f95-1aa6-4369-90b7-9ca2ee1e0890",
  created_at: "2025-06-21T15:50:05.930Z",
  customer: {
    name: "fake-name",
    email: "fake-email",
    phone: "fake-pohone",
    address: {},
    document: "fake-docuemtne",
  },
  description: "proposal.description",
  expire_at: "2025-06-21T15:50:05.930Z",
  items: [
    {
      id: "be79c269-2d41-45ed-a219-6ded59bf4f9f",
      description: "dklasjdlkjaslkdjklsajdlkasjkldjkasd",
      estimate_id: "b1b77332-5107-44b1-b0ba-c9ba402bcba6",
      name: "OLaskjdklashdjkashkjdhaskjhdk",
      price: 250.7,
      quantity: 6,
      total: 1504.2,
      type: "MATERIAL",
      unit: "UNITS",
      created_at: "2025-06-21T15:50:05.931Z",
      updated_at: "2025-06-21T15:50:05.931Z",
    },
  ],
  total: 3000.45,
  updated_at: "2025-06-21T15:50:05.930Z",
};

const rows = estimate.items;

const columns = [
  {
    key: "type",
    label: "Tipo",
  },
  {
    key: "description",
    label: "Descrição",
  },
  {
    key: "quantity",
    label: "Quantidade",
  },
  {
    key: "price",
    label: "Preço",
  },

  {
    key: "total",
    label: "Total",
  },
];

export function EstimateDetailPage() {
  const { company, customer, description, total, expire_at, created_at } =
    estimate;

  return (
    <div className="space-y-6 fade-in max-w-6xl mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center justify-center w-full">
            {company.avatar && (
              <Avatar src={company.avatar} alt={company.name} size="lg" />
            )}
            <Text type="subtitle">{company.name}</Text>
            <Text>
              {company.email} | {company.phone}
            </Text>
            <Text>
              {company.address.props.address}, {company.address.props.city} -{" "}
              {company.address.props.state}
            </Text>
          </div>
        </CardHeader>

        {/* Bloco Cliente */}
        <CardBody>
          <div className="space-y-2">
            <Text
              type="normal"
              className="flex items-center gap-2 text-pink-600 font-semibold"
            >
              <FiUser /> Cliente
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div>
                <span className="font-medium">Nome:</span> {customer.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {customer.email}
              </div>
              <div>
                <span className="font-medium">Telefone:</span> {customer.phone}
              </div>
              <div>
                <span className="font-medium">Documento:</span>{" "}
                {customer.document}
              </div>
            </div>
          </div>
        </CardBody>

        {/* Datas */}
        <CardBody>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <FiCalendar /> Criado em:{" "}
              {new Date(created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiCalendar /> Válido até:{" "}
              {new Date(expire_at).toLocaleDateString()}
            </div>
          </div>
        </CardBody>

        {/* Descrição */}
        {description && (
          <CardBody>
            <h3 className="font-medium mb-1">Descrição</h3>
            <p className="text-sm">{description}</p>
          </CardBody>
        )}

        {/* Itens da Proposta */}
        <CardBody>
          <div>
            <h2 className="font-semibold text-pink-600 mb-2">
              Itens da Proposta
            </h2>

            <Table isStriped>
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={rows}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardBody>

        {/* Total */}
        <CardBody>
          <div className="flex items-end gap-2 justify-end">
            <Text type="small" color="muted">
              Total:
            </Text>
            <Text type="subtitle">
              {formatCurrency(total, { showCurrency: true })}
            </Text>
          </div>
        </CardBody>

        {/* Condições Gerais */}
        <CardFooter>
          <div className="text-xs text-center w-full">
            Essa é uma proposta comercial. Seu teor, desde que aceito no prazo
            informado, vincula as partes acima descritas.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
