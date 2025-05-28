import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { useAuthStore } from '../../stores/authStore';
import { getCompaniesByOwnerId } from '../../api/companies';
import { getProposalsByCompanyId } from '../../api/proposals';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { FiFileText, FiLoader } from 'react-icons/fi';

const ProposalsPage = () => {
  const { user } = useAuthStore();

  const { data: companies } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: () => getCompaniesByOwnerId(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: proposals, isLoading } = useQuery({
    queryKey: ['proposals', companies],
    queryFn: async () => {
      if (!companies?.length) return [];
      
      const allProposals = await Promise.all(
        companies.map((company) => getProposalsByCompanyId(company.id))
      );
      console.log('allProposals',allProposals);
      
      return allProposals.flat();
    },
    enabled: !!companies?.length,
  });

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Propostas</h1>
        <p className="text-neutral-600">Gerencie as propostas enviadas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Minhas Propostas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : !proposals?.length ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhuma proposta enviada</h3>
              <p className="text-neutral-600">
                Você ainda não enviou nenhuma proposta.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <Link
                  key={proposal.id}
                  to={`/dashboard/proposals/${proposal.id}`}
                  className="block"
                >
                  <div className="p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-medium">
                          {proposal.estimate_request.name}
                        </h4>
                        <p className="text-sm text-neutral-500 mt-1">
                          {proposal.company.name}
                        </p>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-neutral-800">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(proposal.amount)}
                        </div>
                        <div className="mt-1 text-sm font-medium px-2 py-1 rounded-full bg-primary-50 text-primary-700">
                          {proposal.status}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                      {proposal.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposalsPage;