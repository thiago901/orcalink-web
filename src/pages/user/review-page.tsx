import { FC, useState } from "react";
import {
  createReview,
  CreateReviewForm,
  CreateReviewSchema,
} from "../../api/review";
import { useForm } from "react-hook-form";
import { CustomInput } from "../../components/ui/Input";
import { CustomTextArea } from "../../components/ui/Textarea";
import FileUpload from "../../components/ui/FileUpload";
import { Button, Card, CardBody } from "@heroui/react";
import { Text } from "../../components/ui/Text";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const Star: FC<{
  filled: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "#fbbf24" : "none"}
    stroke="#fbbf24"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="w-8 h-8 cursor-pointer transition-colors duration-200"
    role="button"
    aria-label={filled ? "Estrela cheia" : "Estrela vazia"}
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export function ReviewPage() {
  const { job_id } = useParams<{ job_id: string }>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<CreateReviewForm>({
    resolver: zodResolver(CreateReviewSchema),
  });

  const handleCreateReview = async (data: CreateReviewForm) => {
    try {
      await createReview({ ...data, rating: rating, job_id: job_id! });
      toast.success("Enviado");
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 mt-12">
      <CardBody>
        <div className="flex justify-center mb-7">
          <Text type="title">Escreva sua Review</Text>
        </div>

        <form onSubmit={handleSubmit(handleCreateReview)} className="space-y-6">
          {/* Título */}
          <div>
            <CustomInput
              name="title"
              label="Título da sua review"
              register={register}
              error_message={errors.title?.message}
            />
          </div>

          {/* Corpo */}
          <div>
            <CustomTextArea
              label="Conte aqui sua experiência..."
              name="comment"
              register={register}
              error_message={errors.comment?.message}
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avaliação
            </label>
            <div
              className="flex items-center space-x-2 justify-center"
              role="radiogroup"
              aria-label="Avaliação de 0 a 5 estrelas"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={star <= (hoverRating || rating)}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>

          <div className="flex w-full items-center justify-center">
            <FileUpload
              onFilesSelected={setSelectedFiles}
              maxFiles={1}
              maxSizeInMB={10}
              multiple={false}
              accept=".jpg,.jpeg,.png"
            />
          </div>

          <div className="text-center">
            <Button type="submit" color="primary">
              Enviar Review
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
