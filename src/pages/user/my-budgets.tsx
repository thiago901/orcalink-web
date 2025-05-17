import { useQuery } from '@tanstack/react-query';
import { Plus, Loader2, MapPin, Calendar } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { getEstimateRequestsByUserId } from '../../api/estimateRequests';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Link,
  Listbox,
  ListboxItem,
} from '@heroui/react';
import { Title } from '../../components/ui/Title';
import { Text } from '../../components/ui/Text';

export function MyBudgetsPage() {
  const { user } = useAuthStore();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['estimateRequests', user?.id],
    queryFn: () => getEstimateRequestsByUserId(user?.id || ''),
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6 fade-in max-w-6xl mx-auto px-4 py-6">
      <Card>
        <CardHeader className="border-b border-neutral-200">
          <div>
            <Title className="text-xl font-semibold">Meus Orçamentos</Title>
            <Text className="text-sm text-neutral-500 mt-1">
              Veja suas solicitações de orçamento e acompanhe o status.
            </Text>
          </div>
        </CardHeader>

        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
          ) : !requests?.length ? (
            <div className="text-center py-12 px-6">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-1">
                Nenhum orçamento encontrado
              </h3>
              <p className="text-sm text-neutral-600 mb-6">
                Você ainda não solicitou nenhum orçamento. Que tal começar agora?
              </p>
              <Button
                as={Link}
                href="/my-budgets/new"
                color="primary"
                startContent={<Plus size={16} />}
              >
                Solicitar Orçamento
              </Button>
            </div>
          ) : (
            <>
            <Listbox className="divide-y divide-neutral-100">
              {requests.map((request) => (
                <ListboxItem
                  key={request.id}
                  href={`/my-budgets/${request.id}`}
                  className="hover:bg-neutral-50 transition"
                >
                  <div className="py-4">
                    <div className="flex justify-between gap-4 items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-neutral-800">
                          {request.name}
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-neutral-500 mt-1">
                          <MapPin size={14} />
                          <span>{request.address.city}, {request.address.state}</span>
                        </div>
                      </div>
                      <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                        {request.proposals?.length || 0} proposta{request.proposals?.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                      {request.description}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
                      <Calendar size={14} />
                      <span>{new Date(request.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
            <div className='p-4 border-t border-neutral-200 flex justify-end'>
            <Button
                as={Link}
                href="/my-budgets/new"
                color="primary"
                startContent={<Plus size={16} />}
              >
                Solicitar Orçamento
              </Button>
            </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
