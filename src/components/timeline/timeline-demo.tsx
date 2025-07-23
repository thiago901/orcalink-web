import React, { useState } from 'react';
import { mockTimelineSteps, simpleTimelineSteps } from './mocks';
import { Card, CardBody, CardHeader, Select, SelectItem } from '@heroui/react';
import { Timeline } from './timeline';




export const TimelineDemo: React.FC = () => {
  const [selectedTimeline, setSelectedTimeline] = useState('complete');

  const timelineOptions = {
    complete: {
      label: 'Timeline Completa (Orçamento)',
      steps: mockTimelineSteps
    },
    simple: {
      label: 'Timeline Simples (Pedido)',
      steps: simpleTimelineSteps
    }
  };

  const currentSteps = timelineOptions[selectedTimeline as keyof typeof timelineOptions].steps;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-col items-start gap-3">
          <h1 className="text-2xl font-bold">Timeline Component Demo</h1>
          <p className="text-gray-600">
            Componente de linha do tempo vertical responsivo e animado para exibir 
            o histórico de etapas de qualquer processo.
          </p>
          
          <div className="w-full max-w-xs">
            <Select
              label="Selecionar Timeline"
              selectedKeys={[selectedTimeline]}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string;
                setSelectedTimeline(key);
              }}
            >
              {Object.entries(timelineOptions).map(([key, option]) => (
                <SelectItem key={key} value={key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardBody className="p-6">
          <Timeline steps={currentSteps} />
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Características do Componente</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">✨ Recursos Visuais</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Bolinhas conectadas por linha vertical</li>
                <li>• Etapa atual com animação pulsante</li>
                <li>• Etapas concluídas com ícone de check</li>
                <li>• Etapas futuras com opacidade reduzida</li>
                <li>• Cards com hover e animações suaves</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-secondary">🔧 Funcionalidades</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Totalmente responsivo</li>
                <li>• Suporte a ações (botões) por etapa</li>
                <li>• Ícones personalizáveis</li>
                <li>• Data/hora opcional</li>
                <li>• Reutilizável para qualquer fluxo</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};