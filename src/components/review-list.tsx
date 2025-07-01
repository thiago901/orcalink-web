

import { Card, CardBody } from "@heroui/react";
import { format } from "date-fns";
import {ptBR} from "date-fns/locale";

import { FaStar } from "react-icons/fa6";

type FileData = {
  id: string;
  company_review_id: string;
  url: string;
};

type Review = {
  id: string;
  title: string;
  comment: string;
  rating: number;
  user_id: string;
  company_id: string;
  files?: FileData[];
  created_at: string;
};

type ReviewListProps = {
  reviews: Review[];
};

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <Card key={review.id} className="shadow-md rounded-2xl p-4">
          <CardBody>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{review.title}</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar
                    key={i}
                    size={18}
                    className={i <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-700 mt-2">{review.comment}</p>

            <p className="text-sm text-gray-500 mt-1">
              Avaliação em {format(new Date(review.created_at), "dd/MM/yyyy", { locale: ptBR })}
            </p>

            {review.files && review.files.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {review.files.map((file) => (
                  <img
                    key={file.id}
                    src={file.url}
                    alt="Imagem do serviço"
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
