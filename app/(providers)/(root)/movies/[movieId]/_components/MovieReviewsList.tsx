import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getReviewsByMovieId } from "@/api/supabase.api"; // Review를 올바르게 import
import { BsStarFill } from "react-icons/bs";

export interface Review {
  id: number;
  user_id: string; // 작성자 ID
  movie_id: string | number; // 영화 ID
  rating: number; // 별점
  content: string; // 리뷰 내용
}

type MovieReviewsListProps = {
  reviews: Review[];
};

const MovieReviewsList: React.FC<MovieReviewsListProps> = ({ reviews }) => {
  return (
    <div>
      <h5 className="text-white font-bold mb-10">
        이 영화에 대한 다양한 리뷰들을 확인해 보세요!
      </h5>
      <ul className="grid grid-cols-1 gap-y-6">
        {reviews.length === 0 ? (
          <li className="text-white">등록된 리뷰가 없습니다.</li>
        ) : (
          reviews.map((review) => (
            <li key={review.id} className="flex items-start gap-x-4">
              {/* 별점 */}
              <div className="flex items-center gap-x-0.5 py-0.5">
                {[...Array(5)].map((_, index) => (
                  <BsStarFill
                    key={index}
                    className={`text-sm ${
                      index < review.rating ? "text-yellow-300" : "text-white"
                    }`}
                  />
                ))}
              </div>
              {/* 리뷰 내용 */}
              <p className="text-white">{review.content}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

function MovieReviews() {
  const params = useParams();
  const movieId = params.movieId as string;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!movieId) return;

      setLoading(true);
      setError(null); // 오류 초기화

      try {
        const data = await getReviewsByMovieId(movieId);
        console.log("Fetched reviews:", data); // 데이터 확인
        setReviews(data); // data는 이제 항상 Review[] 타입
      } catch (error) {
        setError("리뷰를 불러오는 데 오류가 발생했습니다."); // 오류 처리
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId]);

  // 로딩, 오류 상태에 대한 조건부 렌더링
  if (loading) return <div>리뷰를 불러오는 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>; // 오류 메시지 표시

  return <MovieReviewsList reviews={reviews} />;
}

export default MovieReviews;
