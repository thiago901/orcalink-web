import { CiStar } from "react-icons/ci";




interface StarRatingProps {
  rating: number; // ex: 4.7
  max?: number; // padrão: 5
  className?: string;
}

export function StarRating({
  rating,
  max = 5,
  className = "h-5 w-5 text-yellow-400",
}: StarRatingProps) {
  let remaining = rating;
  const stars = Array.from({ length: max }, () => {
    if (remaining >= 1) {
      remaining--;

      return 1;
    } else if (remaining > 0) {
      const partial = remaining;

      remaining = 0;

      return partial;
    } else {
      return 0;
    }
  });

  return (
    <div className="flex items-center gap-1">
      
      {stars.map((fill, index) => (
        <div key={index} className="relative">
          {/* Star background (empty) */}
          <CiStar className={className + " text-gray-300"} />

          {/* Star fill (partial/full) */}
          {fill > 0 && (
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <CiStar className={className} fill="#f1c40f"/>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
