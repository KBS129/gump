"use client";

import Header from "@/components/Header";
import LikeMovieButton from "@/components/LikeMovieButton";
import Page from "@/components/Page";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  getMovie,
  getMovieCredits,
  MovieDetail,
  Cast,
} from "../../../../../api/tmdb.api";
import MovieReviewsList from "./_components/MovieReviewsList";
import { FaRegComment } from "react-icons/fa6";
import Rating from "@/components/Rating";
import { useState } from "react";
import { useModal } from "@/app/(providers)/(_providers)/ModalProvider";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieDetailPage = () => {
  const params = useParams();
  const { openModal } = useModal();
  const movieId = params.movieId as string;
  const [clickedStars, setClickedStars] = useState<boolean[]>(
    new Array(5).fill(false)
  );

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery<MovieDetail | null>({
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

  const { data: cast } = useQuery<Cast[]>({
    queryKey: ["movieCast", movieId],
    queryFn: async () => {
      if (movieId) {
        return await getMovieCredits(movieId);
      } else {
        throw new Error("영화 ID가 제공되지 않았습니다.");
      }
    },
    enabled: !!movieId,
  });

  if (isLoading) return <div>영화 정보를 불러오는 중..</div>;
  if (isError)
    return (
      <div>
        영화 정보를 불러오는 데 오류가 발생했습니다. 나중에 다시 시도해 주세요.
      </div>
    );
  if (!movie) return <div>영화를 찾을 수 없습니다.</div>;

  const handleStarClick = (index: number) => {
    const updatedStars = clickedStars.map((_, i) => i <= index);
    setClickedStars(updatedStars);
  };

  return (
    <>
      <Header />
      <Page>
        <div className="relative min-h-screen bg-black text-white">
          <img
            src={IMAGE_BASE_URL + movie.backdrop_path}
            className="aspect-[16/9] md:aspect-[16/4.5] object-cover w-full blur-sm"
            alt={movie.title}
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-0" />
          <div className="p-6 md:p-20 relative z-10">
            <div className="flex flex-col md:flex-row justify-between gap-x-10">
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-5xl font-bold">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <h2 className="text-lg md:text-2xl mt-2">{movie.tagline}</h2>
                )}
                <p className="text-base md:text-lg m't-4 md:mt-8">
                  {movie.overview}
                </p>
                <time className="mt-4 md:mt-8 text-sm text-white/60">
                  {movie.release_date}
                </time>
                <ul className="flex flex-wrap gap-2 md:gap-4 text-black mt-2 md:mt-4">
                  {movie.genres.map((genre) => (
                    <li
                      key={genre.id}
                      className="bg-white px-2 py-1 md:px-2.5 md:py-1 rounded-md font-medium text-xs md:text-sm"
                    >
                      #{genre.name}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-x-10">
                  <button
                    onClick={() => openModal("newReview")}
                    className="text-lg md:text-3xl bg-white text-black px-8 py-2 md:px-16 md:py-4 rounded-lg font-bold hover:brightness-90 active:brightness-75 transition flex items-center gap-x-2 md:gap-x-4"
                  >
                    <span>리뷰 남기기</span>
                    <FaRegComment />
                  </button>
                  <LikeMovieButton movieId={movieId || ""} />
                </div>
                <Rating clicked={clickedStars} onStarClick={handleStarClick} />
                <div className="mt-8 md:mt-12">
                  <MovieReviewsList />
                </div>
                <div className="mt-8 md:mt-12">
                  <h3 className="text-2xl md:text-3xl font-bold">출연진</h3>
                  <ul className="flex flex-wrap gap-4 md:gap-6 mt-4">
                    {cast?.slice(0, 8).map((actor) => (
                      <li key={actor.id} className="w-20 md:w-28 text-center">
                        <img
                          src={
                            actor.profile_path
                              ? IMAGE_BASE_URL + actor.profile_path
                              : "/default_profile.png"
                          }
                          alt={actor.name}
                          className="rounded-lg w-full"
                        />
                        <p className="mt-2 text-xs md:text-base font-medium">
                          {actor.name}
                        </p>
                        <p className="text-xs text-gray-300">
                          {actor.character}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <img
                src={IMAGE_BASE_URL + movie.poster_path}
                className="shadow-2xl w-full md:max-w-sm self-start mt-6 md:mt-0"
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
