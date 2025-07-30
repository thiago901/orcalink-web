import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";

import { FiMessageCircle } from "react-icons/fi";

import { useAuthStore } from "../../stores/authStore";
import { ProposalChat } from "./proposal-chat";
import { getProposalById } from "../../api/proposals";
import { useQuery } from "@tanstack/react-query";

type ProposalChatProps = {
  proposal_id: string;
  sender: "CLIENT" | "COMPANY";
};
export function ProposalChatButton({ proposal_id, sender }: ProposalChatProps) {
  const { user } = useAuthStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    data: proposal,
    isLoading: isLoadingProposal,
    refetch: refetchProposal,
  } = useQuery({
    queryKey: ["proposal", proposal_id],
    queryFn: () => getProposalById(proposal_id),
    enabled: !!proposal_id,
  });
  

  return (
    <>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Chats</DrawerHeader>
              <DrawerBody className="p-0">
                {!!user && !!proposal && (
                  <ProposalChat
                    sender={sender}
                    estimate_request_id={proposal.estimate_request_id}
                    proposal_id={proposal.id}
                    messages={proposal.messages}
                    company={{
                      id: proposal.company.id,
                      name: proposal.company.name,
                      avatar: proposal.company.avatar,
                    }}
                    onSend={() => {}}
                    onUpload={() => {}}
                  />
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <Button onPress={onOpen} isIconOnly>
        <FiMessageCircle size={24} />
      </Button>
    </>
  );
}
