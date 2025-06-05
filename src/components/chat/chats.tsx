import { Avatar, Chip, Listbox, ListboxItem, cn } from "@heroui/react";
import { useState } from "react";
import { Chat } from "./chat";


import { getEstimateRequestMessagesByCompany } from "../../api/estimate-requests-messages";
import { useQuery } from "@tanstack/react-query";

const ChevronRightIcon = (props) => {
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

const ItemCounter = ({ number }) => (
  <div className="flex items-center gap-1 text-default-400">
    <Chip color="primary" className="text-small">{number}</Chip>
    <ChevronRightIcon className="text-xl" />
  </div>
);

export type ChatContacts = {
  id: string;
  avatar?: string;
  name: string;
  unread_amount:number
};

type ChatsProps = {
  estimate_request_id: string;
  sender:"COMPANY" |"CLIENT"

  contacts: ChatContacts[];
};
export function Chats({ contacts, estimate_request_id ,sender}: ChatsProps) {
  
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [contact, setContact] = useState<ChatContacts | null>(null);
  const {
    data: estimate_request_messages,
    isLoading: isLoadingRequestMessages,
  } = useQuery({
    queryKey: ["estimateRequestMessages", companyId, estimate_request_id],
    queryFn: () =>
      getEstimateRequestMessagesByCompany(estimate_request_id, companyId!),
    enabled: !!companyId,
  });


  return (
    <div>
      
      {!companyId ? (
        <Listbox
          aria-label="User Menu"
          className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 overflow-visible shadow-small "
          itemClasses={{
            base: "px-3 gap-3 h-12 data-[hover=true]:bg-default-100/80",
          }}
          
        >
          {contacts.map((contact) => (
            <ListboxItem
              key={contact.id}
              endContent={<ItemCounter number={contact.unread_amount} />}
              startContent={<Avatar src={contact.avatar} size="sm" />}
              onPress={() => {
                setCompanyId(contact.id.toString())
                setContact(contact)
              }}
            >
              {contact.name}
            </ListboxItem>
          ))}
        </Listbox>
      ) : (
        <Chat
          companyId={companyId}
          estimate_request_id={estimate_request_id}
          contact={contact!}
          messages={!estimate_request_messages? []:estimate_request_messages}
          onSend={() => console.log("")}
          onUpload={() => console.log("")}
          onBack={() => setCompanyId(null)}
          sender={sender}
        />
      )}
    </div>
  );
}
