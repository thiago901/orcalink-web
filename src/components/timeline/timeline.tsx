import React from "react";

import { TimelineProps, TimelineStep } from "./time-types";

import { Card, CardBody, Chip } from "@heroui/react";
import { Text } from "../ui/Text";

export const Timeline: React.FC<TimelineProps> = ({
  steps,
  className = "",
  showSteps,
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
          circle: "bg-primary-500 border-primary-500",
          line: "bg-gray-200",
          card: "border-primary-300 bg-primary-50/50 shadow-lg",
          animation: "animate-ping",
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
      {steps
        .filter((item) =>
          !showSteps ? true : showSteps.find((s) => s === item.type)
        )
        .map((step, index) => {
          const styles = getStepStyles(step.status);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative flex items-start gap-4 pb-8">
              {/* Timeline Line */}
              {!isLast && (
                <div
                  className={`absolute left-3 top-6 w-0.5 h-full ${styles.line} transition-colors duration-300`}
                  style={{ transform: "translateX(-50%)" }}
                />
              )}

              <span className="relative z-10 flex-shrink-0">
                <span
                  className={`absolute inline-flex h-full w-full ${styles.animation} rounded-full bg-sky-400 opacity-75`}
                ></span>
                <span
                  className={`relative w-6 h-6 rounded-full flex items-center justify-center
                  ${styles.circle}`}
                ></span>
              </span>

              {/* Timeline Card */}
              <Card
                className={`
                flex-1 border transition-all duration-300 hover:shadow-md
                ${styles.card}
              `}
              >
                <CardBody className="p-4">
                  <div className="flex gap-3 flex-col md:items-center md:flex-row">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 ">
                        <Text weight="semibold">{step.title}</Text>
                        {step.status === "current" && (
                          <Chip
                            color="primary"
                            variant="flat"
                            size="sm"
                            
                          >
                            Atual
                          </Chip>
                        )}
                      </div>

                      <div className="mb-2 mt-1">
                        {step.description && (
                          <Text
                            type="caption"
                            weight="light"
                            dangerouslySetInnerHTML={{
                              __html: step.description,
                            }}
                          />
                        )}
                      </div>

                      {/* {step.date && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>📅</span>
                        <span>
                          {format(step.date, "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    )} */}
                    </div>

                    {/* Actions */}
                    {/* {!!my_types[step.type] && (
                    <div className="flex flex-col gap-2">
                      {my_types[step.type]()}
                    </div>
                  )} */}
                    {!!step.actions && (
                      <div className="flex flex-col gap-2">{step.actions}</div>
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
