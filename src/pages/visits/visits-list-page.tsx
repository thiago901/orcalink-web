// src/pages/visits/index.tsx
import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

interface Visit {
  id: string;
  scheduled_at: string;
  status: string;
}
const my_visit = [
  {
    id:'1',
    scheduled_at: '2023-10-01T10:00:00Z',
    status: 'Pendente',
  },
  {
    id:'2',
    scheduled_at: '2023-10-02T11:00:00Z',
    status: 'Confirmada',
  },
  {
    id:'3',
    scheduled_at: '2023-10-03T12:00:00Z',
    status: 'Pendente',
  },
]
export function VisitsListPage() {
  const [visits, setVisits] = useState<Visit[]>(my_visit);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch(`/api/visits/company/COMPANY_ID`, {
  //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //   })
  //     .then(res => res.json())
  //     .then(data => setVisits(data));
  // }, []);

  return (
    <div className="p-6 grid grid-cols-1 gap-4">
      <h1 className="text-2xl font-bold">Visitas Pendentes</h1>
      {visits.map(visit => (
        <Card key={visit.id} onClick={() => navigate(`/visits/${visit.id}`)} className="cursor-pointer">
          <CardBody className="p-4">
            <p><strong>Data:</strong> {new Date(visit.scheduled_at).toLocaleString()}</p>
            <p><strong>Status:</strong> {visit.status}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
