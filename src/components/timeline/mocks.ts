import { TimelineStep } from '../types/timeline';

// Mock data para demonstrar diferentes cenários de timeline
export const mockTimelineSteps: TimelineStep[] = [
  {
    id: '1',
    title: 'Orçamento Criado',
    description: 'Solicitação de orçamento para instalação de ar condicionado residencial.',
    icon: '📝',
    status: 'completed',
    date: new Date('2024-12-10T09:30:00'),
  },
  {
    id: '2',
    title: 'Propostas Recebidas',
    description: '3 propostas foram recebidas de diferentes prestadores de serviço.',
    icon: '📩',
    status: 'completed',
    date: new Date('2024-12-12T14:15:00'),
    actions: [
      {
        id: 'view-proposals',
        label: 'Ver Propostas',
        variant: 'bordered',
        color: 'primary',
        onClick: () => alert('Visualizando propostas...')
      }
    ]
  },
  {
    id: '3',
    title: 'Proposta Aceita',
    description: 'Proposta da TechCool Ar Condicionado foi aceita - R$ 2.500,00.',
    icon: '✅',
    status: 'completed',
    date: new Date('2024-12-13T16:45:00'),
    actions: [
      {
        id: 'schedule-visit',
        label: 'Agendar Visita',
        variant: 'solid',
        color: 'success',
        onClick: () => alert('Redirecionando para agendamento...')
      }
    ]
  },
  {
    id: '4',
    title: 'Visita Solicitada',
    description: 'Visita técnica agendada para avaliação e instalação.',
    icon: '📅',
    status: 'current',
    date: new Date('2024-12-20T10:00:00'),
  },
  {
    id: '5',
    title: 'Nova Data Sugerida',
    description: 'Prestador sugeriu reagendamento devido à disponibilidade de peças.',
    icon: '🔁',
    status: 'pending',
    actions: [
      {
        id: 'accept-suggestion',
        label: 'Aceitar',
        variant: 'solid',
        color: 'success',
        onClick: () => alert('Data aceita!')
      },
      {
        id: 'reject-suggestion',
        label: 'Recusar',
        variant: 'bordered',
        color: 'danger',
        onClick: () => alert('Sugestão recusada!')
      }
    ]
  },
  {
    id: '6',
    title: 'Visita Realizada',
    description: 'Instalação concluída com sucesso. Equipamento funcionando perfeitamente.',
    icon: '🧰',
    status: 'pending',
    actions: [
      {
        id: 'make-payment',
        label: 'Realizar Pagamento',
        variant: 'solid',
        color: 'primary',
        onClick: () => alert('Redirecionando para pagamento...')
      }
    ]
  },
  {
    id: '7',
    title: 'Pagamento Efetuado',
    description: 'Pagamento de R$ 2.500,00 processado com sucesso via PIX.',
    icon: '💳',
    status: 'pending',
  }
];

// Exemplo de timeline mais simples
export const simpleTimelineSteps: TimelineStep[] = [
  {
    id: '1',
    title: 'Pedido Criado',
    description: 'Seu pedido foi criado e está sendo processado.',
    icon: '📦',
    status: 'completed',
    date: new Date('2024-12-15T10:00:00'),
  },
  {
    id: '2',
    title: 'Em Preparação',
    description: 'Estamos preparando seu pedido para envio.',
    icon: '⚙️',
    status: 'current',
  },
  {
    id: '3',
    title: 'Enviado',
    description: 'Seu pedido foi enviado e está a caminho.',
    icon: '🚚',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Entregue',
    description: 'Pedido entregue com sucesso.',
    icon: '✅',
    status: 'pending',
  }
];