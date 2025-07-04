import { useCallback, useState } from "react";
import { cancelSubscription } from "../api/payments";
import { LoadingComponent } from "./loading-component";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionByUserId } from "../api/subscriptions";
import { listAllPlans, Plan } from "../api/plan";
import { FiCheck, FiStar, FiUsers, FiX, FiZap } from "react-icons/fi";
import { useAuthStore } from "../stores/authStore";

import { Button, Card, CardBody, CardHeader, Chip, Link, useDisclosure } from "@heroui/react";
import { Text } from "./ui/Text";
import { format } from "date-fns";
import { CheckoutButton } from "./payment/checkout-button";
import { WarningChangePlanModal } from "./modals/warning-change-plan-modal";

const icons = {
  free: FiUsers,
  essential: FiStar,
  profissional: FiZap,
};

type PlansCardComponentProps={
  plans?:Plan[]
}
export function PlansCardComponent(props:PlansCardComponentProps) {
  const { user, refetchProfile } = useAuthStore();
  const { isOpen, onOpen,onClose } = useDisclosure();

  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["plans"],
    queryFn: () => listAllPlans(),
    enabled: true,
  });
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: () => getSubscriptionByUserId(),
    enabled: true,
  });

  const getPrice = (plan: Plan) => {
    if (plan.price_month === 0) return "Grátis";
    const price = plan.price_month;
    return `R$ ${price.toFixed(2)}`;
  };
  const handleCancelSubscription = useCallback(async () => {
    if (user) {
      await cancelSubscription(user.email);
      refetchProfile();
    }
  }, [user, refetchProfile]);

  return (
    <>
      <LoadingComponent isLoading={!isLoadingPlans && !isLoadingSubscription}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {plans?.map((plan) => {
            const PlanIcon = icons[plan.id as keyof typeof icons];
            const isCurrentPlan = plan.id === subscription?.plan_id;

            return (
              <Card
                key={plan.id}
                className={`transition-all hover:shadow-lg border-gray-200
              } ${isCurrentPlan ? "ring-2 ring-brand-500" : ""}`}
              >
                <CardHeader className={`text-center  pt-6}`}>
                  <div className="flex flex-col w-full justify-center justify-items-center">
                    <div className="flex justify-end">
                      {isCurrentPlan ? (
                        <div className="flex flex-col gap-2 items-end">
                          <Chip color="primary">Atual</Chip>
                          {subscription?.end_date && (
                            <div className="flex items-center gap-2">
                              <Text type="small" color="muted">
                                Finaliza em:{" "}
                              </Text>
                              <Chip color="warning">
                                {format(subscription?.end_date, "dd/MM/yyyy")}
                              </Chip>
                            </div>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PlanIcon className="h-8 w-8 text-brand-600" />
                    </div>
                    <Text type="subtitle" align="center">
                      {plan.name}
                    </Text>
                    <Text type="small" align="center" color="muted">
                      {plan.description}
                    </Text>

                    <div className="py-4">
                      <div className="text-3xl font-bold text-gray-900">
                        {getPrice(plan)}
                        {plan.price_month > 0 && (
                          <span className="text-lg font-normal text-gray-600">
                            /mês
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="px-6 pb-6 flex-1">
                  <div className="space-y-3 mb-6 h-full">
                    {plan.resources.map((feature, index) =>
                      feature.active ? (
                        <div key={index} className="flex items-start">
                          <FiCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {feature.label}{" "}
                          </span>
                        </div>
                      ) : (
                        <div
                          key={index}
                          className="flex items-start opacity-60"
                        >
                          <FiX className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-500">
                            {feature.label}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {!user ? (
                    <Button
                      as={Link}
                      href="/login"
                      color="primary"
                      className="h-16"
                    >
                      Assinar plano
                    </Button>
                  ) : !isCurrentPlan && user.plan_id !== "free" ? (
                    <Button
                      fullWidth
                      className="h-16"
                      color="primary"
                      onPress={onOpen}
                    >
                      Voltar para versao gratis
                    </Button>
                  ) : (
                    <CheckoutButton
                      isDisabled={isCurrentPlan}
                      fullWidth
                      className="h-16"
                      color={isCurrentPlan ? "default" : "primary"}
                      email={user.email}
                      priceId={plan.price_id_month}
                    />
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      </LoadingComponent>

      <WarningChangePlanModal
      isOpen={isOpen}
      onClose={onClose}
      onAccept={handleCancelSubscription}
      />
    </>
  );
}
