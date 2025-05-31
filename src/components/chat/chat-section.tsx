import { useState, useMemo } from "react";
import { Chat } from "./chat";




type ChatGrouped = Record<
  string,
  {
    company_name: string;
    user_name: string;
    messages: Message[];
  }
>;

export type Message = {
    id: string;
    content: string;
    type: "text" | "image";
    user_id: string;
    user_name: string;
    company_id: string;
    company_name: string;
    created_at: string;
  };
interface Props {
  messages: Message[];
  onSend: (msg: string, companyId: string) => void;
  onUpload: (img: File, companyId: string) => void;
}

export function cn(...classes: (string | false | undefined | null)[]) {
    return classes.filter(Boolean).join(" ");
  }

export function ChatSidebarLayout({ messages, onSend, onUpload }: Props) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const grouped = useMemo<ChatGrouped>(() => {
    return messages.reduce((acc, msg) => {
      if (!acc[msg.company_id]) {
        acc[msg.company_id] = {
          company_name: msg.company_name,
          user_name: msg.user_name,
          messages: [],
        };
      }
      acc[msg.company_id].messages.push(msg);
      return acc;
    }, {} as ChatGrouped);
  }, [messages]);

  const selected = selectedCompanyId ? grouped[selectedCompanyId] : null;

  return (
    <div className="border rounded-lg overflow-hidden flex h-[600px]">
      {/* Sidebar com empresas */}
      <aside className="w-1/3 border-r bg-neutral-50">
        {Object.entries(grouped).map(([companyId, { company_name, messages }]) => {
          const lastMessage = messages[messages.length - 1];
          const isSelected = companyId === selectedCompanyId;

          return (
            <button
              key={companyId}
              onClick={() => setSelectedCompanyId(companyId)}
              className={cn(
                "w-full text-left px-4 py-3 hover:bg-primary-50 border-b",
                isSelected && "bg-primary-100"
              )}
            >
              <div className="font-medium text-neutral-800">{company_name}</div>
              <div className="text-sm text-neutral-600 truncate">
                {lastMessage?.content}
              </div>
            </button>
          );
        })}
      </aside>

      {/* Janela de chat */}
      <div className="w-2/3 relative bg-white">
        {selected ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b font-medium text-neutral-800 bg-neutral-50">
              Chat com {selected.company_name}
            </div>
            <Chat
              messages={selected.messages}
              onSend={(msg) => onSend(msg, selectedCompanyId!)}
              onUpload={(img) => onUpload(img, selectedCompanyId!)}
              companyId={selectedCompanyId!}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500">
            Selecione um prestador à esquerda para iniciar o chat.
          </div>
        )}
      </div>
    </div>
  );
}
