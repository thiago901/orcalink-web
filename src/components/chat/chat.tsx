import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Input,
  ScrollShadow,
} from "@heroui/react";
import {
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import { FiPaperclip, FiSend } from "react-icons/fi";
import {
  createEstimateRequestMessage,
  EstimateRequestMessage,
  EstimateRequestMessageGrouped,
} from "../../api/estimate-requests-messages";
import { FaArrowLeft } from "react-icons/fa6";

import { useAuthStore } from "../../stores/authStore";
import { useSocketStore } from "../../stores/useSocketStore";


interface ChatBoxProps {
  
  contact: EstimateRequestMessageGrouped;
  sender: "CLIENT" | "COMPANY";
  onSend: (message: string) => void;
  onUpload: (imageDataUrl: string) => void;
  onBack?: () => void;
}

export function Chat({
  onUpload,

  onBack,
  contact,

  sender,
}: ChatBoxProps) {
  const { connect, on, off, emit } = useSocketStore();
  const { user } = useAuthStore();

  const [internalMessages, setInternalMessages] = useState(contact.messages);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setInternalMessages(contact.messages);
  }, [contact.messages]);

  useEffect(() => {
    scrollToBottom();
  }, [internalMessages]);

  const appendMessage = useCallback((message: EstimateRequestMessage) => {
    setInternalMessages((prev) => [
      ...prev,
      {
        content: message.content,
        created_at: message.created_at,
        id: message.id,
        read: message.read,
        sender: message.sender,
        type: message.type,
        updated_at: message.updated_at,
      },
    ]);
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (!user) return;

    connect();
    emit("join:room", { roomId: contact.estimate_request.id });

    const handleIncomingMessage = (data: {
      message: EstimateRequestMessage;
    }) => {
      if (data.message.sender !== sender) {
        appendMessage(data.message);
      }
    };

    on("message:recieve", handleIncomingMessage);

    return () => {
      off("message:recieve", handleIncomingMessage);
    };
  }, [
    appendMessage,
    connect,
    contact.estimate_request.id,
    emit,
    off,
    on,
    sender,
    user,
  ]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !contact.company.id) return;

    const payload = {
      company_id: contact.company.id,
      content: input.trim(),
      sender,
      estimate_request_id: contact.estimate_request.id,
      type: "TEXT" as const,
    };

    try {
      setIsSending(true);
      const newMessage = await createEstimateRequestMessage(payload);

      appendMessage({
        company_name: newMessage.company_name,
        user_name: newMessage.user_name,

        id: newMessage.id,
        content: input.trim(),

        read: newMessage.read,
        sender: newMessage.sender,
        type: newMessage.type,
        created_at: newMessage.created_at,
        updated_at: newMessage.updated_at,
        company_id: newMessage.company_id,
        estimate_request_id: newMessage.estimate_request_id,
      });

      setInput("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="flex flex-col rounded-none h-full">
      <CardHeader className="border-b flex gap-4 items-center">
        {onBack && (
          <Button isIconOnly variant="light" radius="none" onPress={onBack}>
            <FaArrowLeft />
          </Button>
        )}

        <Avatar src={sender==='COMPANY'?contact.user.avatar:contact.company.avatar} />
        <h4 className="font-semibold text-lg">{sender==='COMPANY'?contact.user.name:contact.company.name}</h4>
      </CardHeader>

      {/* Essa div precisa crescer e permitir scroll */}
      <ScrollShadow className="flex-1 px-4 py-2 space-y-4" ref={chatEndRef}>
        {internalMessages.map((msg, idx) => {
          const isMe = msg.sender === sender;
          const date = new Date(msg.created_at);

          return (
            <div
              key={idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-neutral-200 text-neutral-800 rounded-bl-none"
                }`}
              >
                {msg.type === "TEXT" ? (
                  <p>{msg.content}</p>
                ) : (
                  <img
                    src={msg.content}
                    alt="imagem"
                    className="max-w-full rounded-md"
                  />
                )}
                <div className="text-[10px] text-neutral-400 mt-1 text-right">
                  {date.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Sentinela para scroll automático */}
        <div ref={chatEndRef} />
      </ScrollShadow>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t px-4 py-3"
      >
        <label className="cursor-pointer">
          <FiPaperclip size={20} className="text-neutral-500" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadImage}
          />
        </label>

        <Input
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button type="submit" variant="ghost" isLoading={isSending} isIconOnly>
          <FiSend size={20} />
        </Button>
      </form>
    </Card>
  );
}
