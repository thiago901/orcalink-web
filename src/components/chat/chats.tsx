import { Avatar, Chip, Listbox, ListboxItem } from "@heroui/react";

import {
  EstimateRequestMessageGrouped,
  getEstimateRequestMessagesFromCompany,
  getEstimateRequestMessagesFromCustomer,
} from "../../api/estimate-requests-messages";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Chat } from "./chat";
import { FiMessageSquare } from "react-icons/fi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChevronRightIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
};

const ItemCounter = ({ number }: { number: number }) => (
  <div className="flex items-center gap-1 text-default-400">
    <Chip color="primary" className="text-small">
      {number}
    </Chip>
    <ChevronRightIcon className="text-xl" />
  </div>
);

export type ChatContacts = {
  id: string;
  avatar?: string;
  name: string;
  unread_amount: number;
};

type ChatsProps = {
  id: string;
  sender: "COMPANY" | "CLIENT";
};

export function EmptyChatState() {
  const message = "Você ainda não recebeu nenhuma mensagem.";

  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-500 p-6">
      <FiMessageSquare size={48} className="mb-3 text-gray-400" />
      <h2 className="text-lg font-semibold mb-1">
        Nenhuma conversa encontrada
      </h2>
      <p className="text-sm">{message}</p>
    </div>
  );
}
export function Chats({ sender, id }: ChatsProps) {
  const [convesation, setConvesation] =
    useState<EstimateRequestMessageGrouped | null>(null);

  const { data: estimate_request_messages } = useQuery({
    queryKey: ["estimateRequestMessages", id],
    queryFn: () =>
      sender === "COMPANY"
        ? getEstimateRequestMessagesFromCompany(id)
        : getEstimateRequestMessagesFromCustomer(id),
    enabled: true,
  });
  

  return (
    <div className="h-full">
      {!convesation ? (
        <Listbox aria-label="User Chats" emptyContent={<EmptyChatState/>}>
          {estimate_request_messages ? (
            estimate_request_messages.map((contact) => (
              <ListboxItem
                key={
                  sender === "COMPANY" ? contact.company.id : contact.user.id
                }
                endContent={<ItemCounter number={contact.unread_amount} />}
                startContent={<Avatar src={""} size="md" />}
                onPress={() => {
                  setConvesation(contact);
                }}
              >
                {sender === "CLIENT" ? contact.company.name : contact.user.name}
              </ListboxItem>
            ))
          ) : (
            <></>
          )}
        </Listbox>
      ) : (
        <Chat
          contact={convesation}
          onSend={() => {
            console.log("send");
          }}
          onUpload={() => {
            console.log("upload");
          }}
          sender={sender}
          onBack={() => {
            setConvesation(null);
          }}
        />
      )}
    </div>
  );
}
