
// src/pages/visits/suggestions.tsx
import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";


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
export function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<any[]>(my_visit);


  return (
    <div className="p-6 grid gap-4">
      <h1 className="text-2xl font-bold">Minhas sugestões de visita</h1>
      {suggestions.map(suggestion => (
        <Card key={suggestion.id}>
          <CardBody className="p-4">
            <p><strong>Nova Data Sugerida:</strong> {new Date(suggestion.suggested_at).toLocaleString()}</p>
            <p><strong>Status:</strong> {suggestion.status}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
