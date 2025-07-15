import { FiTool } from "react-icons/fi";
import { Card, CardBody, Button, Link, CardHeader } from "@heroui/react";

export function PageUnderConstruction() {
  return (
    
      <Card className="min-h-screen flex flex-col items-center justify-center text-center p-6 " radius="none" shadow="none">
        <CardHeader>
          <h1 className="text-4xl font-bold mb-4 text-center w-full">Página em Construção</h1>
        </CardHeader>
        <CardBody className="flex flex-col items-center py-10">
          <FiTool className="w-24 h-24 text-primary-500 animate-bounce mb-4" />
          
          <p className="text-neutral-600 mb-6">
            Estamos trabalhando para criar algo incrível para você! Em breve esta página estará disponível com todos os detalhes e funcionalidades.
          </p>
          <Button as={Link} href="/" color="primary">
            Voltar para a Página Inicial
          </Button>
        </CardBody>
      </Card>
    
  );
}


