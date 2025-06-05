import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
} from "@heroui/react";
import { useRef, useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import { FiPaperclip, FiSend } from "react-icons/fi";
import {
  createEstimateRequestMessage,
  EstimateRequestMessage,
} from "../../api/estimate-requests-messages";
import { FaArrowLeft } from "react-icons/fa6";
import { ChatContacts } from "./chats";
import { v4 } from "uuid";
import { socket as socketFun } from "../../utils/socket";
import { useAuthStore } from "../../stores/authStore";
import { useSocketStore } from "../../stores/useSocketStore";

interface ChatBoxProps {
  messages: EstimateRequestMessage[];
  onSend: (message: string) => void;
  onUpload: (imageDataUrl: string) => void;
  onBack: () => void;
  companyId: string | null;
  contact: ChatContacts;
  estimate_request_id:string;
  sender: 'CLIENT' |'COMPANY'
}

export function Chat({
  messages,
  onSend,
  onUpload,
  companyId,
  onBack,
  contact,
  estimate_request_id,
  sender
}: ChatBoxProps) {
  const [internalMessages, setInternalMessages] = useState(messages);
  const [mmessages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  
  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    setInternalMessages(messages)
  }, [messages]);


  const handleSendMessage = useCallback((message:EstimateRequestMessage)=>{

    console.log('RECEBI UMA MENSAGEM',message);
    
    setInternalMessages((old) => [
      ...old,
      {
        company_name:message.company_name,
        created_at:message.created_at,
        updated_at:message.updated_at,
        id:message.id,
        user_name:message.user_name,
        company_id:message.company_id,
        content:message.content,
        estimate_request_id:message.estimate_request_id,
        sender:message.sender,
        type:message.type,
      }
     ])
  },[])


  const { connect, on, off, emit } = useSocketStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    connect(); // cria conexão (só uma vez)

    const handleMessage = (data: any) => {
      console.log('[Chat] Nova mensagem:', data);
    };
    on('room:joined', handleMessage);
    emit('join:room', { roomId: estimate_request_id ||'91b00ee5-266f-44b3-9b5c-f8212d1dc612' });
    on('chat:message', handleMessage);
    on('message:recieve', (data) => {
          console.log('message:recieve',data,data.message.sender!==sender);
          
          if(data.message.sender!==sender){
    
            handleSendMessage(data.message);
          }
        });

    return () => {
      off('chat:message', handleMessage);
    };
  }, [connect, emit, estimate_request_id, handleSendMessage, off, on, sender, user]);

  // useEffect(() => {
  //   console.log('iniciou a tela');
  //   const socket = socketFun()
  //   //********* INVES de entrar na sala ao conectar apenas entrar na sala ja que ele vai ta conectado */
  //   socket.on('connect', () => {
  //     console.log('✅ Conectado com ID:', socket.id);

  //     // Entrar na sala do orçamento
  //     socket.emit('join:room', { roomId: estimate_request_id ||'91b00ee5-266f-44b3-9b5c-f8212d1dc612' });

  //     // (opcional) confirmação
  //     socket.on('room:joined', (data) => {
  //       console.log('🛏️ Entrou na sala:', data.roomId);
  //     });
  //   });


  //   socket.on('message:recieve', (data) => {
  //     console.log('message:recieve',data,data.message.sender!==sender);
      
  //     if(data.message.sender!==sender){

  //       handleSendMessage(data.message);
  //     }
  //   });

  //   return () => {
  //     // Limpando listeners
      
  //     socket.off('room:joined');
  //     socket.off('message:recieve');
  //   };
  // }, [estimate_request_id, handleSendMessage, sender]);
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // onSend(input.trim());
    const payload ={
      company_id: companyId!,
      content: input.trim(),
      sender,
      estimate_request_id,
      type: "TEXT",
    }
    await createEstimateRequestMessage(payload);
    console.log('payload',payload);
    
    setInternalMessages((old) => [
      ...old,
      {
        company_name:contact.name,
        created_at:new Date(),
        updated_at:new Date(),
        id:v4(),
        user_name:"",
        ...payload
      },
    ]);
    setInput("");
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
    <Card className="h-[500px] flex flex-col rounded-none">
      <CardHeader className="border-b flex gap-4">
        <div className="flex">
          <Button isIconOnly variant="light" radius="none" onPress={onBack}>
            <FaArrowLeft />
          </Button>
          <Avatar src={contact.avatar} />
        </div>
        <h4 className="font-semibold text-lg">{contact.name}</h4>
      </CardHeader>

      <CardBody className="overflow-y-auto flex-1 space-y-4">
        
        {internalMessages?.map((msg, idx) => {
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
        <div ref={chatEndRef} />
      </CardBody>

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

        <Button type="submit" variant="ghost">
          <FiSend size={20} />
        </Button>
      </form>
    </Card>
  );
}
