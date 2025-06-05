import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/authStore";
import {
  getEstimateRequestsByUserId,
  ResponseEstimateRequests,
} from "../../api/estimateRequests";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Link,
  Listbox,
  ListboxItem,
  Tab,
  Tabs,
} from "@heroui/react";
import { Text } from "../../components/ui/Text";
import { FiLoader } from "react-icons/fi";
import { CiCalendar, CiMapPin } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { Subtitle } from "../../components/ui/Subtitle";
import { MdInbox } from "react-icons/md";

function EmptyResponse() {
  return (
    <div className="flex flex-col items-center justify-center py-5">
      <div className="w-14 h-14 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
        <CiMapPin size={30} />
      </div>
      <Subtitle className="text-neutral-900 mb-1">
        Nenhum orçamento encontrado
      </Subtitle>
      <Text className="text-neutral-900 mb-6">
        Você ainda não solicitou nenhum orçamento. Que tal começar agora?
      </Text>
      <Button
        as={Link}
        href="/my-budgets/new"
        color="primary"
        startContent={<FaPlus size={16} />}
      >
        Novo Orçamento
      </Button>
    </div>
  );
}
function EmptyListBox() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8">
      <MdInbox size={32} className="mb-2" />
      <Text type="normal">Nenhum item encontrado</Text>
    </div>
  );
}

interface ListboxEstimateRequestProps {
  isLoading: boolean;
  data: ResponseEstimateRequests;
}
function ListboxEstimateRequest({
  data,
  isLoading,
}: ListboxEstimateRequestProps) {
  return (
    <Card>
      <CardBody className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <FiLoader className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : (
          <Listbox className="p-0" emptyContent={<EmptyListBox />}>
            {data?.estimate_requests.map((request) => (
              <ListboxItem key={request.id} href={`/my-budgets/${request.id}`}>
                <div className="p-4">
                  <div className="flex justify-between gap-4 items-start">
                    <div className="flex-1">
                      <Text type="subtitle" weight="semibold">
                        {request.name}
                      </Text>
                      <div className="flex items-center gap-3 my-1">
                        <Chip color="default" size="sm">
                          Pintura
                        </Chip>
                        <div className="flex items-center gap-1">
                          <CiMapPin size={14} />
                          <Text color="muted" type="small">
                            {request.address.city}, {request.address.state}
                          </Text>
                        </div>
                        <div className="flex items-center gap-1 ">
                          <CiCalendar size={14} />
                          <Text color="muted" type="small">
                            {new Date(request.created_at).toLocaleDateString(
                              "pt-BR"
                            )}
                          </Text>
                        </div>
                      </div>
                    </div>
                    <Chip color="secondary">
                      {request.proposals?.length > 1
                        ? `${request.proposals?.length} Propostas`
                        : `${request.proposals?.length} Proposta`}
                    </Chip>
                  </div>

                  <Text color="muted">{request.description}</Text>
                </div>
              </ListboxItem>
            ))}
          </Listbox>
        )}
      </CardBody>
    </Card>
  );
}
export function MyBudgetsPage() {
  const { user } = useAuthStore();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["estimateRequests", user?.id],
    queryFn: () => getEstimateRequestsByUserId(user?.id || ""),
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6 fade-in max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <Text type="title" weight="bold">
            Meus Orçamentos
          </Text>
          <Text type="normal" weight="light">
            Veja suas solicitações de orçamento e acompanhe o status.
          </Text>
        </div>
        <Button
          as={Link}
          href="/my-budgets/new"
          color="primary"
          startContent={<FaPlus size={16} />}
        >
          Novo Orçamento
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        <Card className="w-full">
          <CardBody>
            <div className="flex flex-col justify-center items-center">
              <Text type="subtitle">
                {requests?.estimate_requests.length || 0}
              </Text>
              <Text type="small">Total</Text>
            </div>
          </CardBody>
        </Card>

        <Card className="w-full">
          <CardBody>
            <div className="flex flex-col justify-center items-center">
              <Text type="subtitle">{requests?.proposals_amout}</Text>
              <Text type="small">Com Propostas</Text>
            </div>
          </CardBody>
        </Card>
        <Card className="w-full">
          <CardBody>
            <div className="flex flex-col justify-center items-center">
              <Text type="subtitle">{requests?.finished_amount}</Text>
              <Text type="small">Concluídos</Text>
            </div>
          </CardBody>
        </Card>
      </div>
      {!requests?.estimate_requests.length ? (
        <EmptyResponse />
      ) : (
        <Tabs aria-label="Options" fullWidth>
          <Tab key="all" title="Todos">
            <ListboxEstimateRequest data={requests} isLoading={isLoading} />
          </Tab>

          <Tab key="proposal" title="Com Propostas">
            <ListboxEstimateRequest
              data={{
                estimate_requests: requests.estimate_requests.filter(
                  (item) => !!item.proposals.length
                ),
                finished_amount: requests.finished_amount,
                proposals_amout: requests.proposals_amout,
              }}
              isLoading={isLoading}
            />
          </Tab>
          <Tab key="finished" title="Concluídas">
            <ListboxEstimateRequest
              data={{
                estimate_requests: requests.estimate_requests.filter(
                  (item) => !!item.finished_at
                ),
                finished_amount: requests.finished_amount,
                proposals_amout: requests.proposals_amout,
              }}
              isLoading={isLoading}
            />
          </Tab>
        </Tabs>
      )}
    </div>
  );
}
