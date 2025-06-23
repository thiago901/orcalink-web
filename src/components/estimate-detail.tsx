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
import * as fns from 'date-fns'
import { FiCalendar, FiUser } from "react-icons/fi";
import { Text } from "./ui/Text";
import { formatCurrency } from "../utils/format";
import { Estimate, EstimateItem } from "../api/estimate";
import { useCallback } from "react";

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

type EstimateDetailProps = {
  estimate: Estimate;
};
export function EstimateDetail({ estimate }: EstimateDetailProps) {
  const { company, customer, description, total, expire_at, created_at } =
    estimate;

  const renderCell = useCallback(
    (estimate_items: EstimateItem, columnKey: keyof EstimateItem) => {
      const cellValue = estimate_items[columnKey];

      switch (columnKey) {
        case "total":
          return formatCurrency(estimate_items.total, { showCurrency: true });
        case "price":
          return formatCurrency(estimate_items.price, { showCurrency: true });

        default:
          if(fns.isDate(cellValue)){
            return cellValue.toString()
          }
          return cellValue;
      }
    },
    []
  );
  return (
    <div>
      <Card shadow="none">
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
              {company.address.street}, {company.address.city} -{" "}
              {company.address.state}
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
              <TableBody items={estimate.items}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey as any)}</TableCell>
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
