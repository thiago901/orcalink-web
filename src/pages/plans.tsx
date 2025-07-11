import {  useState } from "react";

import {
  
  FiUsers,
  FiBarChart,
  FiStar,
  FiZap,
} from "react-icons/fi";

import {
  Button,
  Card,
  CardBody,
  CardHeader,

  Link,

  Tab,
  Tabs,
} from "@heroui/react";
import { Text } from "../components/ui/Text";

import { useAuthStore } from "../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { listAllPlans, Plan } from "../api/plan";

import { PlansCardComponent } from "../components/plans-card";

const icons = {
  free: FiUsers,
  essential: FiStar,
  profissional: FiZap,
};

export function ProviderPlans() {
  const { user } = useAuthStore();

  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["plans"],
    queryFn: () => listAllPlans(),
    enabled: true,
  });

  const [isAnnual, setIsAnnual] = useState(false);

  const currentPlanData = plans?.find((plan) => plan.id === user?.plan_id);
  const PlanIconCurrent = icons[currentPlanData?.id as keyof typeof icons];
  const getPrice = (plan: Plan) => {
    if (plan.price_month === 0) return "Grátis";
    const price = isAnnual ? plan.price_year / 12 : plan.price_month;
    return `R$ ${price.toFixed(2)}`;
  };

  const allResourceKeys = Array.from(
    new Set(plans?.flatMap((plan) => plan.resources.map((r) => r.key)))
  );

  const table = allResourceKeys.map((resourceKey) => {
    const row: Record<string, string> = { resource: resourceKey };

    plans?.forEach((plan) => {
      const resource = plan.resources.find((r) => r.key === resourceKey);

      if (!resource) {
        row[plan.id] = "❌ Não disponível";
      } else if (resource.limit !== undefined) {
        row[plan.id] = `✅ ${resource.label} (Limite: ${resource.limit})`;
      } else if (resource.active) {
        row[plan.id] = `✅ ${resource.label}`;
      } else {
        row[plan.id] = `❌ ${resource.label}`;
      }
      row["resource"] = resource?.label || "";
    });

    return row;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Planos OrçaLink
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Escolha o plano ideal para fazer seu negócio crescer
        </p>
      </div>

      {/* Current Plan Info */}
      {currentPlanData && (
        <Card className="mb-8 border-brand-200 bg-brand-50">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                  {/* <currentPlanData.icon className="h-6 w-6 text-brand-600" /> */}
                  <PlanIconCurrent size={30} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-900">
                    Plano Atual: {currentPlanData.name}
                  </h3>
                  <p className="text-brand-700">
                    {getPrice(currentPlanData)}
                    {currentPlanData.price_month > 0 && "/mês"}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <PlansCardComponent plans={plans}/>

      {/* Additional Information */}
      <Tabs defaultSelectedKey="features" fullWidth>
        <Tab key="features" title="Recursos Detalhados">
          <Card>
            <CardHeader>
              <Text type="subtitle">Comparação Detalhada de Recursos</Text>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium">Recurso</th>
                      {plans?.map((plan) => (
                        <th className="text-center py-3 font-medium">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {table?.map((item) => (
                      <tr>
                        <td className="py-3">{item.resource}</td>
                        <td className="text-center">{item.free}</td>
                        <td className="text-center">{item.essential}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="faq" title="Perguntas Frequentes">
          <Card>
            <CardHeader>
              <Text type="subtitle">Perguntas Frequentes</Text>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">
                  Posso cancelar a qualquer momento?
                </h4>
                <p className="text-gray-600 text-sm">
                  Sim, você pode cancelar sua assinatura a qualquer momento. Não
                  há multas ou taxas de cancelamento — após o cancelamento, você
                  continuará com acesso até o fim do ciclo vigente.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Posso mudar de plano?</h4>
                <p className="text-gray-600 text-sm">
                  Sim, você pode fazer upgrade ou downgrade do seu plano a
                  qualquer momento. O downgrade será aplicado ao final do ciclo
                  atual. Em caso de upgrade, a cobrança da diferença será feita
                  no próximo ciclo.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Como funciona a cobrança?</h4>
                <p className="text-gray-600 text-sm">
                  Trabalhamos apenas com planos mensais. A cobrança é feita
                  automaticamente no cartão de crédito e é renovado a assinatura
                  após o término do período , até que você cancele.
                </p>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="support" title="Suporte">
          <Card>
            <CardHeader>
              <Text type="subtitle">Precisa de Ajuda?</Text>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <FiUsers className="h-12 w-12 text-brand-600 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Fale Conosco</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Nossa equipe está pronta para ajudar você a escolher o
                    melhor plano
                  </p>
                  <Button as={Link} href="/contact" variant="ghost">Entrar em Contato</Button>
                </div>
{/* 
                <div className="text-center p-6 border rounded-lg">
                  <FiBarChart className="h-12 w-12 text-brand-600 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Demonstração</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Agende uma demonstração personalizada dos recursos premium
                  </p>
                  <Button variant="ghost">Agendar Demo</Button>
                </div> */}
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
