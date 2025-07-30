import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
  Link,
  Spinner,
} from "@heroui/react";
import {  Button} from "@heroui/react";
import {  useEffect, useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useParams } from "react-router-dom";
import { getJobById, updateJob, updateJobCompany } from "../../api/jobs-service";
import { ProposalDetailModal } from "../../components/proposals/proposal-detail-modal";
import { MdOutlineOpenInNew } from "react-icons/md";
import { Text } from "../../components/ui/Text";

const steps = [
  { label: "Backlog", value: "BACKLOG" },
  { label: "Em andamento", value: "IN_PROGRESS" },
  { label: "Finalizado", value: "FINISHED" },
];

export function CompanyJobDetailPage() {
  const [currentStep, setCurrentStep] = useState("BACKLOG");
  const [selectedProposal, setSelectedProposal] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading: isLoadingRequest } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id!),
    enabled: !!id,
  });

  useEffect(()=>{
    if(job){
      setCurrentStep(job.status)
    }
  },[job])

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (proposal_id:string) =>  updateJobCompany(proposal_id, {finished_company_at:new Date()}),
    onSuccess: () => {
      console.log("Status atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao atualizar:", error);
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Detalhes do Trabalho</h1>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Atualizar Status</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            {steps.map((step) => (
              <Button
                key={step.value}
                variant={currentStep === step.value ? "solid" : "ghost"}
                color="primary"
                onPress={() => setCurrentStep(step.value)}
              >
                {step.label}
              </Button>
            ))}
          </div>
          <Button
            color="primary"
            onPress={() => job?mutate(job.proposal_id):null}
            isLoading={isPending}
            isDisabled={!job}
          >
            Salvar
          </Button>
        </CardBody>
      </Card>

      {!job ? (
        <Spinner />
      ) : (
        <>
          <Card>
            <CardBody>
              <div className="flex items-center gap-2 justify-between">
                <Accordion>
                  <AccordionItem
                    title={
                      <Text weight="semibold">Solicitação do cliente</Text>
                    }
                  >
                    <div className="flex flex-col">
                      <Text>{job.estimate_request.description}</Text>
                      <Button
                        as={Link}
                        color="primary"
                        href={`/company/budgets/${job.estimate_request_id}`}
                        className="justify-self-end self-end"
                      >
                        <MdOutlineOpenInNew />
                        Acessar
                      </Button>
                    </div>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center gap-2 justify-between">
                <Text weight="semibold">Acessar detalhes do orçamento</Text>
                <Button
                  color="primary"
                  onPress={() => setSelectedProposal(true)}
                >
                  <MdOutlineOpenInNew />
                  Abrir orçamento
                </Button>
              </div>
            </CardBody>
          </Card>
        </>
      )}
      {job && (
        <ProposalDetailModal
          isOpen={selectedProposal}
          onClose={() => setSelectedProposal(false)}
          estimate_id={job.estimate_id}
          proposal_id={job.proposal_id}
          sender="COMPANY"
        />
      )}
    </div>
  );
}
