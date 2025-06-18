import { Button, Card, cn } from "@heroui/react";
import { CiMail } from "react-icons/ci";
import { FiAlertTriangle, FiCheck, FiUserPlus } from "react-icons/fi";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function EmailNotVerified() {
  const { isAuthenticated, user,refetchProfile } = useAuthStore();
  const nativation = useNavigate();

  const steps = [
    { label: "Cadastro", icon: <FiUserPlus size={18} />, done: true },
    { label: "Verificação de E-mail", icon: <CiMail size={18} />, done: false },
    { label: "Acesso Liberado", icon: <FiCheck size={18} />, done: false },
  ];
 useEffect(()=>{
    refetchProfile()
    
 },[refetchProfile])
 useEffect(()=>{
    if(user?.active){
        nativation("/")
      }
    
 },[user,nativation])
  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* Step Indicator */}
      <Card className="w-full max-w-xl mx-auto mb-6">
        <div className="flex items-center justify-center space-x-4 py-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className={cn(
                  "rounded-full p-2",
                  step.done ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                )}
              >
                {step.icon ?? <span className="font-bold">{index + 1}</span>}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  step.done ? "text-green-600" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && <div className="w-6 h-px bg-gray-400" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Alert Card */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center mx-auto">
        <div className="flex justify-center mb-4 text-yellow-500 animate-pulse">
          <FiAlertTriangle size={48} />
        </div>
        <h1 className="text-2xl font-bold mb-2">E-mail não verificado</h1>
        <p className="text-sm text-gray-600 mb-6">
          Por favor, acesse seu e-mail ({user?.email}) e clique no link de verificação que enviamos para ativar sua conta.
        </p>

        <Button variant="solid" fullWidth className="mb-3">
          Reenviar E-mail de Verificação
        </Button>

        <Button variant="ghost" fullWidth>
          Voltar para Login
        </Button>
      </div>
    </div>
  );
}
