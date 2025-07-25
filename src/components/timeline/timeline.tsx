import React from "react";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TimelineProps, TimelineStep } from "./time-types";
import { FaCheck } from "react-icons/fa6";
import { Button, Card, CardBody, Chip, Progress } from "@heroui/react";
import { CheckoutButton } from "../payment/checkout-button";

const my_types = {
  PROPOSALS_WAITING:()=> (
    <Progress
      isIndeterminate
      aria-label="Loading..."
      className="max-w-md"
      size="sm"
    />
  ),
  PROPOSALS_ACCEPTED: ()=>(
    <Button
      variant="solid"
      color="primary"
      size="sm"
      // onPress={action.onClick}
      className="transition-transform hover:scale-105"
    >
      Ver proposta
    </Button>
  ),
  VISIT_REQUESTED:()=> (
    <Button
      variant="solid"
      color="primary"
      size="sm"
      // onPress={action.onClick}
      className="transition-transform hover:scale-105"
    >
      Agendar uma visita
    </Button>
  ),
  VISIT_SUGGESTED:()=> (
    <div className="flex flex-col gap-2">
  
      <Button
        variant="solid"
        color="success"
        size="sm"
        // onPress={action.onClick}
        className="transition-transform hover:scale-105"
      >
        Aceitar
      </Button>
          <Button
        variant="bordered"
        color="danger"
        size="sm"
        // onPress={action.onClick}
        className="transition-transform hover:scale-105"
      >
        Recusar/Reagendar
      </Button>
    </div>
  ),
  PAYMENT_REQUESTED:()=><CheckoutButton proposal_id='464a3c68-8e2d-4e9a-a30f-70eb07fda4d8' />,
  WAITING:()=><div className="flex flex-col gap-2">
  
      <Button
        variant="solid"
        color="success"
        size="sm"
        // onPress={action.onClick}
        className="transition-transform hover:scale-105"
      >
        Confirmar finalização
      </Button>
          
    </div>
};

export const Timeline: React.FC<TimelineProps> = ({
  steps,
  className = "",
}) => {
  const getStepStyles = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed":
        return {
          circle: "bg-success-500 border-success-500 text-white",
          line: "bg-success-200",
          card: "border-success-200 bg-success-50/30",
          animation: "",
        };
      case "current":
        return {
          circle: "bg-primary-500 border-primary-500 text-white animate-pulse",
          line: "bg-gray-200",
          card: "border-primary-300 bg-primary-50/50 shadow-lg",
          animation: "animate-pulse",
        };
      case "pending":
        return {
          circle: "bg-gray-200 border-gray-300 text-gray-400",
          line: "bg-gray-200",
          card: "border-gray-200 bg-gray-50/30 opacity-60",
          animation: "",
        };
    }
  };

  return (
    <div className={`relative ${className}`}>
      {steps.map((step, index) => {
        const styles = getStepStyles(step.status);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative flex items-start gap-4 pb-8">
            {/* Timeline Line */}
            {!isLast && (
              <div
                className={`absolute left-6 top-12 w-0.5 h-full ${styles.line} transition-colors duration-300`}
                style={{ transform: "translateX(-50%)" }}
              />
            )}

            {/* Timeline Circle */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300 ${styles.circle} ${styles.animation}
                `}
              >
                {step.status === "completed" ? (
                  <FaCheck className="w-5 h-5" />
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}
              </div>
            </div>

            {/* Timeline Card */}
            <Card
              className={`
                flex-1 border transition-all duration-300 hover:shadow-md
                ${styles.card}
              `}
            >
              <CardBody className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {step.title}
                      </h3>
                      {step.status === "current" && (
                        <Chip
                          color="primary"
                          variant="flat"
                          size="sm"
                          className="animate-pulse"
                        >
                          Atual
                        </Chip>
                      )}
                    </div>

                    {step.description && (
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    )}

                    {step.date && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>📅</span>
                        <span>
                          {format(step.date, "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {/* {!!my_types[step.type] && (
                    <div className="flex flex-col gap-2">
                      {my_types[step.type]()}
                    </div>
                  )} */}
                  {!!step.actions  && (
                    <div className="flex flex-col gap-2">
                      {step.actions}
                    </div>
                  )}
                  {/* {step.actions && step.actions.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {step.actions.map((action) => (
                        <Button
                          key={action.id}
                          variant={action.variant || 'solid'}
                          color={action.color || 'primary'}
                          size="sm"
                          onPress={action.onClick}
                          className="transition-transform hover:scale-105"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )} */}
                </div>
              </CardBody>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
