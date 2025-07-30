import React from 'react';


import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCheck } from 'react-icons/fi';
import { Button, Card, CardBody, Chip } from '@heroui/react';


export const CompactTimeline: React.FC<any> = ({ 
  steps, 
  orientation = 'vertical',
  className = '',
  compact = false
}) => {
  const getStepStyles = (status: any['status']) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-success-500 border-success-500 text-white',
          line: 'bg-success-300',
          card: 'border-success-200 bg-success-50/40',
          text: 'text-success-700'
        };
      case 'current':
        return {
          circle: 'bg-primary-500 border-primary-500 text-white animate-pulse shadow-lg shadow-primary-200',
          line: 'bg-gray-300',
          card: 'border-primary-300 bg-primary-50/60 shadow-md',
          text: 'text-primary-700'
        };
      case 'pending':
        return {
          circle: 'bg-gray-200 border-gray-300 text-gray-500',
          line: 'bg-gray-200',
          card: 'border-gray-200 bg-gray-50/40 opacity-70',
          text: 'text-gray-600'
        };
    }
  };

  if (orientation === 'horizontal') {
    return (
      <div className={`w-full ${className}`}>
        {/* Desktop Horizontal */}
        <div className="hidden lg:block">
          <div className="flex items-start justify-between relative">
            {/* Connecting Line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 z-0" />
            
            {steps.map((step, index) => {
              const styles = getStepStyles(step.status);
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10" style={{ width: `${100 / steps.length}%` }}>
                  {/* Circle */}
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-4 bg-white ${styles.circle} transition-all duration-300`}>
                    {step.status === 'completed' ? (
                      <FiCheck className="w-5 h-5" />
                    ) : (
                      <span className="text-lg">{step.icon}</span>
                    )}
                  </div>

                  {/* Card */}
                  <Card className={`w-full max-w-xs border transition-all duration-300 hover:shadow-lg ${styles.card}`}>
                    <CardBody className={compact ? "p-3" : "p-4"}>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'} ${styles.text}`}>
                            {step.title}
                          </h3>
                          {step.status === 'current' && (
                            <Chip color="primary" variant="flat" size="sm" className="animate-pulse">
                              Atual
                            </Chip>
                          )}
                        </div>

                        {step.description && !compact && (
                          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                            {step.description}
                          </p>
                        )}

                        {step.date && (
                          <div className="text-xs text-gray-500 mb-3">
                            {format(step.date, compact ? "dd/MM" : "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                        )}

                        {/* Actions */}
                        {step.actions && step.actions.length > 0 && (
                          <div className="flex flex-col gap-1">
                            {step.actions.map((action) => (
                              <Button
                                key={action.id}
                                variant={action.variant || 'solid'}
                                color={action.color || 'primary'}
                                size={compact ? 'sm' : action.size || 'sm'}
                                onPress={action.onClick}
                                className="w-full transition-transform hover:scale-105"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Fallback */}
        <div className="lg:hidden">
          <CompactTimeline steps={steps} orientation="vertical" compact={compact} />
        </div>
      </div>
    );
  }

  // Vertical Timeline
  return (
    <div className={`relative ${className}`}>
      {steps.map((step, index) => {
        const styles = getStepStyles(step.status);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative flex items-start gap-3 pb-6">
            {/* Timeline Line */}
            {!isLast && (
              <div 
                className={`absolute left-5 top-12 w-0.5 h-full ${styles.line} transition-colors duration-300`}
                style={{ transform: 'translateX(-50%)' }}
              />
            )}

            {/* Timeline Circle */}
            <div className="relative z-10 flex-shrink-0">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${styles.circle}`}>
                {step.status === 'completed' ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <span className="text-sm">{step.icon}</span>
                )}
              </div>
            </div>

            {/* Timeline Card */}
            <Card className={`flex-1 border transition-all duration-300 hover:shadow-md ${styles.card}`}>
              <CardBody className={compact ? "p-3" : "p-4"}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'} ${styles.text}`}>
                        {step.title}
                      </h3>
                      {step.status === 'current' && (
                        <Chip color="primary" variant="flat" size="sm" className="animate-pulse">
                          Atual
                        </Chip>
                      )}
                    </div>

                    {step.description && !compact && (
                      <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                        {step.description}
                      </p>
                    )}

                    {step.date && (
                      <div className="text-xs text-gray-500">
                        📅 {format(step.date, compact ? "dd/MM 'às' HH:mm" : "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {step.actions && step.actions.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                      {step.actions.map((action) => (
                        <Button
                          key={action.id}
                          variant={action.variant || 'solid'}
                          color={action.color || 'primary'}
                          size={compact ? 'sm' : action.size || 'sm'}
                          onPress={action.onClick}
                          className="transition-transform hover:scale-105"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        );
      })}
    </div>
  );
};