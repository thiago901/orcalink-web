

// src/pages/visits/[id].tsx
import { Button, Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const visitdata={
    id:'3',
    scheduled_at: '2023-10-03T12:00:00Z',
    status: 'Pendente',
  }
export function VisitDetailPage() {
  const { id } = useParams();
  const [visit, setVisit] = useState<any>(visitdata);

  // useEffect(() => {
  //   fetch(`/api/visits/${id}`, {
  //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //   })
  //     .then(res => res.json())
  //     .then(data => setVisit(data));
  // }, [id]);

  const confirmVisit = () => {
    fetch(`/api/visits/${id}/confirm`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => window.location.reload());
  };

  const suggestNewDate = () => {
    const date = prompt("Nova data (YYYY-MM-DD HH:mm)");
    if (!date) return;
    fetch(`/api/visits/${id}/suggest-new-date/${encodeURIComponent(date)}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => window.location.reload());
  };

  if (!visit) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardBody className="p-4 space-y-2">
          <p><strong>Data Agendada:</strong> {new Date(visit.scheduled_at).toLocaleString()}</p>
          <p><strong>Status:</strong> {visit.status}</p>
          {visit.notes && <p><strong>Notas:</strong> {visit.notes}</p>}
          <div className="flex gap-2 mt-4">
            <Button onPress={confirmVisit}>Confirmar</Button>
            <Button variant="ghost" onPress={suggestNewDate}>Sugerir nova data</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
