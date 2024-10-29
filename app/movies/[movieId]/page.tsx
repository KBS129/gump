'use client'

import { FaPlay } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMovie, MovieDetail } from '../../../api/tmdb.api';
import LikeMovieButton from "@/components/LikeMovieButton";
import Page from "@/components/Page";
import Header from "@/components/Header";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieDetailPage = () => {
  const params = useParams();
  const movieId = params.movieId as string;

  const { data: movie, isLoading, isError } = useQuery<MovieDetail | null>({
    queryKey: ["movies", movieId],
    queryFn: async () => {
      if (movieId) {
        return await getMovie(movieId);
      } else {
        throw new Error("영화 ID가 제공되지 않았습니다.");
      }
    },
    enabled: !!movieId,
  });

  if (isLoading) return <div>영화 정보를 불러오는 중...</div>;
  if (isError) return <div>영화 정보를 불러오는 데 오류가 발생했습니다. 나중에 다시 시도해 주세요.</div>;
  if (!movie) return <div>영화를 찾을 수 없습니다.</div>;

  return (
    <>
      <Header />
      <Page>
        <div className="relative min-h-screen bg-black text-white"> {/* 배경색과 텍스트 색상 추가 */}
          <img
            src={IMAGE_BASE_URL + movie.backdrop_path}
            className="aspect-[16/4.5] object-cover w-full blur-sm" // 흐리게 처리
            alt={movie.title}
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-0" /> {/* 그라디언트 레이어 */}
          <div className="p-20 relative z-10"> {/* z-10으로 이미지 위에 올리기 */}
            <div className="flex justify-between gap-x-10">
              <div className="flex flex-col">
                <h1 className="text-5xl font-bold">{movie.title}</h1>
                {movie.tagline && <h2 className="text-2xl mt-2">{movie.tagline}</h2>}
                <p className="text-lg mt-8">{movie.overview}</p>
                <time className="mt-8 text-sm text-white/60">{movie.release_date}</time>
                <ul className="flex items-center gap-x-4 text-black mt-2">
                  {movie.genres.map((genre) => (
                    <li key={genre.id} className="bg-white px-2.5 py-1 rounded-md font-medium">
                      #{genre.name}
                    </li>
                  ))}
                </ul>
                <div className="mt-12 flex items-center gap-x-10">
                  <button className="text-3xl bg-white text-black px-16 py-4 rounded-lg font-bold hover:brightness-90 active:brightness-75 transition flex items-center gap-x-4">
                    <span>리뷰 남기기</span>
                    <FaPlay />
                  </button>
                  <LikeMovieButton movieId={movieId || ""} />
                </div>
              </div>
              <img
                src={IMAGE_BASE_URL + movie.poster_path}
                className="shadow-2xl max-w-sm"
                alt={movie.title}
              />
            </div>
          </div>
        </div>
      </Page>
    </>
  );
  
};

export default MovieDetailPage;
