"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaHeart } from "react-icons/fa";
import { checkIsLikedMovie, likeMovie, unlikeMovie } from "@/api/tmdb.api"; // 경로 수정

interface LikeMovieButtonProps {
  movieId: string | number;
}

function LikeMovieButton({ movieId }: LikeMovieButtonProps) {
  const queryClient = useQueryClient();
  const queryKey = ["isLikedMovie", { movieId }];
  const { data: isLikedMovie } = useQuery({	
    queryKey,
    queryFn: () => checkIsLikedMovie(movieId),
  });
  const { mutateAsync: likeMovieMutationFn } = useMutation({
    mutationFn: (movieId: string | number) => likeMovie(movieId),
  });
  const { mutateAsync: unlikeMovieMutationFn } = useMutation({
    mutationFn: (movieId: string | number) => unlikeMovie(movieId),
  });

  const handleClickLikeButton = async () => {
    if (isLikedMovie) {
      await unlikeMovieMutationFn(movieId);
    } else {
      await likeMovieMutationFn(movieId);
    }
    queryClient.invalidateQueries({ queryKey, exact: true });
  };

  return (
    <button
      onClick={handleClickLikeButton}
      className={`border-white/20 p-4 rounded-full border-2 bg-white/20 ${
        isLikedMovie ? "text-red-500" : "text-white/70"
      } active:brightness-50 transition`}
    >
      <FaHeart className="text-4xl transition" />
    </button>
  );
}

export default LikeMovieButton;
