import { useState } from "react";

import { FiCheck, FiStar, FiZap, FiUsers, FiBarChart } from "react-icons/fi";
import { MdBusinessCenter } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Switch,
  Tab,
  Tabs,
} from "@heroui/react";
import { Text } from "../components/ui/Text";

export function ProviderPlans() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("basic");

  const plans = [
    {
      id: "free",
      name: "Gratuito",
      description: "Ideal para começar",
      icon: FiUsers,
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        "Até 5 propostas por mês",
        "Perfil básico da empresa",
        "Chat com clientes",
        "Suporte por email",
        "Acesso a orçamentos públicos",
      ],
      limitations: [
        "Sem destaque nas buscas",
        "Sem analytics avançados",
        "Sem múltiplas empresas",
      ],
    },
    {
      id: "basic",
      name: "Básico",
      description: "Para profissionais ativos",
      icon: FiStar,
      monthlyPrice: 39.9,
      annualPrice: 399.0,
      popular: false,
      features: [
        "Até 50 propostas por mês",
        "Perfil destacado",
        "Chat ilimitado",
        "Agenda integrada",
        "Suporte prioritário",
        "Analytics básicos",
        "Notificações em tempo real",
      ],
      limitations: ["Uma empresa por conta", "Sem recursos premium"],
    },
    {
      id: "professional",
      name: "Profissional",
      description: "Para empresas em crescimento",
      icon: FiZap,
      monthlyPrice: 79.9,
      annualPrice: 799.0,
      popular: true,
      features: [
        "Propostas ilimitadas",
        "Destaque premium nas buscas",
        "Múltiplas empresas (até 3)",
        "Analytics avançados",
        "Relatórios detalhados",
        "Integração com calendário",
        "Suporte telefônico",
        "Badge de verificação",
        "Prioridade em orçamentos",
      ],
      limitations: [],
    },
    {
      id: "enterprise",
      name: "Empresarial",
      description: "Para grandes empresas",
      icon: MdBusinessCenter,
      monthlyPrice: 149.9,
      annualPrice: 1499.0,
      popular: false,
      features: [
        "Todos os recursos do Profissional",
        "Empresas ilimitadas",
        "API personalizada",
        "Dashboard executivo",
        "Gestor de conta dedicado",
        "Treinamento personalizado",
        "Relatórios customizados",
        "Integração com CRM",
        "White label disponível",
      ],
      limitations: [],
    },
  ];

  const currentPlanData = plans.find((plan) => plan.id === currentPlan);

  const getPrice = (plan: (typeof plans)[0]) => {
    if (plan.monthlyPrice === 0) return "Grátis";
    const price = isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice;
    return `R$ ${price.toFixed(2)}`;
  };

  const getSavings = (plan: (typeof plans)[0]) => {
    if (plan.monthlyPrice === 0) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.annualPrice;
    const percentage = (savings / monthlyCost) * 100;
    return percentage.toFixed(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Planos OrçaFácil
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Escolha o plano ideal para fazer seu negócio crescer
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span
            className={`text-sm ${
              !isAnnual ? "text-brand-600 font-medium" : "text-gray-600"
            }`}
          >
            Mensal
          </span>
          <Switch
            isSelected={isAnnual}
            onValueChange={setIsAnnual}
            className="data-[state=checked]:bg-brand-600"
          />
          <span
            className={`text-sm ${
              isAnnual ? "text-brand-600 font-medium" : "text-gray-600"
            }`}
          >
            Anual
          </span>
          {isAnnual && <Chip color="secondary">Economize até 20%</Chip>}
        </div>
      </div>

      {/* Current Plan Info */}
      {currentPlanData && (
        <Card className="mb-8 border-brand-200 bg-brand-50">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                  <currentPlanData.icon className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-900">
                    Plano Atual: {currentPlanData.name}
                  </h3>
                  <p className="text-brand-700">
                    {getPrice(currentPlanData)}
                    {currentPlanData.monthlyPrice > 0 && "/mês"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-brand-600">Ativo</Badge>
                <Button variant="ghost">Gerenciar Assinatura</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          const isCurrentPlan = plan.id === currentPlan;

          return (
            <Card
              key={plan.id}
              className={`transition-all hover:shadow-lg ${
                plan.popular
                  ? "border-brand-500 shadow-lg scale-105"
                  : "border-gray-200"
              } ${isCurrentPlan ? "ring-2 ring-brand-500" : ""}`}
            >
              {plan.popular && (
                <div className="w-full bg-blue-500 flex gap-2 justify-center items-center">
                  <HiSparkles />
                  <Text type="normal" color="light">Mais Popular</Text>
                </div>
              )}

              <CardHeader
                className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}
              >
                <div className="flex flex-col w-full justify-center justify-items-center">
                  <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlanIcon className="h-8 w-8 text-brand-600" />
                  </div>
                  <Text type="subtitle" align="center">
                    {plan.name}
                  </Text>
                  <Text type="small" align="center" color="muted">{plan.description}</Text>

                  <div className="py-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {getPrice(plan)}
                      {plan.monthlyPrice > 0 && (
                        <span className="text-lg font-normal text-gray-600">
                          /mês
                        </span>
                      )}
                    </div>
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <div className="text-sm text-green-600">
                        Economize {getSavings(plan)}% no plano anual
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardBody className="px-6 pb-6 flex-1">
                <div className="space-y-3 mb-6 h-full">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <FiCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature} </span>
                    </div>
                  ))}

                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start opacity-60">
                      <span className="text-gray-400 mr-3 mt-0.5">×</span>
                      <span className="text-sm text-gray-500">
                        {limitation}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  color={isCurrentPlan?'default':plan.popular? 'secondary':'primary'}
                  isDisabled={isCurrentPlan}
                >
                  {isCurrentPlan
                    ? "Plano Atual"
                    : plan.monthlyPrice === 0
                    ? "Começar Grátis"
                    : "Assinar Agora"}
                </Button>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Additional Information */}
      <Tabs defaultSelectedKey="features" fullWidth>
        <Tab key="features" title="Recursos Detalhados" >
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
                      <th className="text-center py-3 font-medium">Gratuito</th>
                      <th className="text-center py-3 font-medium">Básico</th>
                      <th className="text-center py-3 font-medium">
                        Profissional
                      </th>
                      <th className="text-center py-3 font-medium">
                        Empresarial
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3">Propostas por mês</td>
                      <td className="text-center">5</td>
                      <td className="text-center">50</td>
                      <td className="text-center">Ilimitadas</td>
                      <td className="text-center">Ilimitadas</td>
                    </tr>
                    <tr>
                      <td className="py-3">Empresas</td>
                      <td className="text-center">1</td>
                      <td className="text-center">1</td>
                      <td className="text-center">3</td>
                      <td className="text-center">Ilimitadas</td>
                    </tr>
                    <tr>
                      <td className="py-3">Analytics</td>
                      <td className="text-center">-</td>
                      <td className="text-center">Básico</td>
                      <td className="text-center">Avançado</td>
                      <td className="text-center">Completo</td>
                    </tr>
                    <tr>
                      <td className="py-3">Suporte</td>
                      <td className="text-center">Email</td>
                      <td className="text-center">Email + Chat</td>
                      <td className="text-center">Email + Chat + Telefone</td>
                      <td className="text-center">Dedicado</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="faq" title="Perguntas Frequentes" >
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
                  há multas ou taxas de cancelamento.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  Como funciona o período de teste?
                </h4>
                <p className="text-gray-600 text-sm">
                  Todos os planos pagos oferecem 14 dias de teste gratuito. Você
                  pode testar todos os recursos sem compromisso.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Posso mudar de plano?</h4>
                <p className="text-gray-600 text-sm">
                  Sim, você pode fazer upgrade ou downgrade do seu plano a
                  qualquer momento. As alterações são aplicadas imediatamente.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Como funciona a cobrança?</h4>
                <p className="text-gray-600 text-sm">
                  A cobrança é feita automaticamente no cartão de crédito
                  cadastrado, de acordo com o ciclo escolhido (mensal ou anual).
                </p>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="support" title="Suporte" >
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
                  <Button variant="ghost">Entrar em Contato</Button>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <FiBarChart className="h-12 w-12 text-brand-600 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Demonstração</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Agende uma demonstração personalizada dos recursos premium
                  </p>
                  <Button variant="ghost">Agendar Demo</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
