import { Card, CardBody } from '@heroui/react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
  } from 'recharts';
import { getDashboardStats } from '../../api/dashboard';
import { useQuery } from '@tanstack/react-query';
  
  
  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];
  type DashboardStatsProps ={
    company_id:string
  }
  export function DashboardStats({ company_id }:DashboardStatsProps) {
    const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
      queryKey: ["dashboard", company_id],
      queryFn: () => getDashboardStats(company_id),
      enabled: !!company_id,
    });
  
    const statusData = [
      { name: 'Aceitas', value: dashboard?.acceptedProposals },
      { name: 'Rejeitadas', value: dashboard?.rejectedProposals },
      { name: 'Pendentes', value: dashboard?.pendingProposals }
    ];
  
    const proposalsFormatted = dashboard?.proposalsLastWeek.map(p => ({
      day: new Date(p.day).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
      total: p.total
    }));
  
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-4">
        {isLoadingDashboard&&`Carrgando... ${isLoadingDashboard}`}
        <Card>
          <CardBody className="p-4">
            <h3 className="text-lg font-semibold">Total de Propostas</h3>
            <p className="text-2xl">{dashboard?.totalProposals}</p>
          </CardBody>
        </Card>
  
        <Card>
          <CardBody className="p-4">
            <h3 className="text-lg font-semibold">Taxa de Aceitação</h3>
            <p className="text-2xl">{(dashboard?.acceptanceRate || 0 * 100).toFixed(1)}%</p>
          </CardBody>
        </Card>
  
        <Card>
          <CardBody className="p-4">
            <h3 className="text-lg font-semibold">Valor Total Aceito</h3>
            <p className="text-2xl">R$ {dashboard?.totalAcceptedAmount.toLocaleString()}</p>
          </CardBody>
        </Card>
  
        <Card className="col-span-1 md:col-span-2">
          <CardBody className="p-4">
            <h3 className="text-lg font-semibold mb-2">Propostas da Última Semana</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={proposalsFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
  
        <Card>
          <CardBody className="p-4">
            <h3 className="text-lg font-semibold mb-2">Distribuição de Propostas</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
  
        <Card>
          <CardBody className="p-4">
            <h3 className="text-lg font-semibold">Orçamentos em até 20km</h3>
            <p className="text-2xl">{dashboard?.nearbyEstimateRequestsCount}</p>
          </CardBody>
        </Card>
      </div>
    );
  }
  