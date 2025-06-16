import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { verifyUser } from "../../api/users";
import { Button, Link } from "@heroui/react";

type VerifyStatus = "loading" | "success" | "error";

export function UserVerifyPage() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<VerifyStatus>("loading");

  useEffect(() => {
    async function load(token: string) {
      try {
        await verifyUser(token);
        
        setStatus("success");
      } catch (error) {
        console.log("error", error);

        setStatus("error");
      }
    }

    if (id) {
      load(id);
    } else {
      setStatus("error");
    }
  }, [id]);

  return (
    <div className="space-y-6 fade-in max-w-6xl mx-auto px-4 py-6 text-center">
      {status === "loading" && (
        <p className="text-gray-600">Validando seu e-mail...</p>
      )}

      {status === "success" && (
        <div>
          <h2 className="text-2xl font-bold text-green-600">
            Conta ativada com sucesso!
          </h2>
          <p className="mt-2 text-gray-700 mb-2">
            Agora você já pode fazer login na plataforma.
          </p>
          <Button as={Link} href="/login" color="primary">Login</Button>
        </div>
      )}

      {status === "error" && (
        <div>
          <h2 className="text-2xl font-bold text-red-600">
            Falha na validação
          </h2>
          <p className="mt-2 text-gray-700">
            Não conseguimos validar seu e-mail. O link pode estar expirado ou
            inválido.
          </p>
        </div>
      )}
    </div>
  );
}
