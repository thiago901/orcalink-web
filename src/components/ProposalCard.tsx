import { Link } from "react-router-dom";


import { Proposal } from "../types";
import { Avatar, Badge, Button, Card, CardBody } from "@heroui/react";
import { CiCalendar, CiLock, CiStar } from "react-icons/ci";
import { FaBriefcase, FaShield } from "react-icons/fa6";
import { FiCheckCircle, FiDollarSign, FiMessageSquare } from "react-icons/fi";


interface ProposalCardProps {
  proposal: Proposal;
  variant?: "client" | "provider";
  onAccept?: () => void;
  onReject?: () => void;
}

export function ProposalCard({
  proposal,
  variant = "client",
  onAccept,
  onReject,
}: ProposalCardProps) {
  const getStatusBadge = (status: Proposal["status"] = 'in_progress') => {
    const statusConfig = {
      sent: { label: "Enviada", color: "bg-blue-100 text-blue-800" },
      accepted: { label: "Aceita", color: "bg-green-100 text-green-800" },
      rejected: { label: "Rejeitada", color: "bg-red-100 text-red-800" },
      in_progress: {
        label: "Em Andamento",
        color: "bg-yellow-100 text-yellow-800",
      },
      completed: { label: "Concluída", color: "bg-gray-100 text-gray-800" },
      cancelled: { label: "Cancelada", color: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <Card className="border-l-4 border-l-brand-400 hover:shadow-md transition-shadow">
      <CardBody className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12" name={proposal.company?.name.charAt(0).toUpperCase() || "P"}>
         
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {proposal.company?.name || "Prestador"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CiStar className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">
                    {proposal.company?.rating}
                  </span>
                  <span className="ml-1">
                    ({proposal.company?.reviewCount})
                  </span>
                </div>
                <div className="flex items-center">
                  <FaBriefcase className="h-4 w-4 mr-1" />
                  <span>{proposal.company?.completedJobs} trabalhos</span>
                </div>
              </div>
            </div>
          </div>
          {getStatusBadge(proposal.status)}
        </div>

        {/* Price and Duration */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FiDollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              R$ {'PRECO'}
            </div>
            <div className="text-xs text-gray-600">Valor total</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CiLock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-lg font-semibold">
              {proposal.estimatedDuration}
            </div>
            <div className="text-xs text-gray-600">Prazo estimado</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FaShield className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-lg font-semibold">
              {proposal.warranty || "N/A"}
            </div>
            <div className="text-xs text-gray-600">Garantia</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FiCheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-semibold">
              {proposal.includesMaterials ? "Sim" : "Não"}
            </div>
            <div className="text-xs text-gray-600">Materiais inclusos</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Descrição da Proposta</h4>
          <p className="text-gray-600 leading-relaxed">
            {proposal.description}
          </p>
        </div>

        {/* Technical Visit */}
        {proposal.technicalVisitRequired && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <CiCalendar className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                Visita técnica necessária antes do in��cio do trabalho
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        {variant === "client" && proposal.status === "sent" && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button variant="light" className="flex-1" >
              <Link to={`/client/chat/${proposal.id}`}>
                <FiMessageSquare className="h-4 w-4 mr-2" />
                Conversar
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              onPress={onReject}
            >
              Recusar
            </Button>

            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onPress={onAccept}
            >
              Aceitar Proposta
            </Button>
          </div>
        )}

        {variant === "client" && proposal.status === "accepted" && (
          <div className="flex gap-3 pt-4 border-t">
            <Button className="flex-1" >
              <Link to={`/client/chat/${proposal.id}`}>
                <FiMessageSquare className="h-4 w-4 mr-2" />
                Ir para Chat
              </Link>
            </Button>
          </div>
        )}

        {/* Provider view actions */}
        {variant === "provider" && (
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="ghost" className="flex-1" >
              <Link to={`/provider/proposals/${proposal.id}/edit`}>
                Editar Proposta
              </Link>
            </Button>

            <Button className="flex-1" >
              <Link to={`/provider/chat/${proposal.id}`}>
                <FiMessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Link>
            </Button>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex justify-between text-xs text-gray-500 pt-3 border-t mt-3">
          <span>
            Enviada em: {"a"}
          </span>
          <span>ID: #{proposal.id}</span>
        </div>
      </CardBody>
    </Card>
  );
}
