"use client";

import { useSession } from "@supabase/auth-helpers-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaHeart } from "react-icons/fa";
import { supabase } from "@/app/supabase";

interface LikeMovieButtonProps {
  movieId: string | number;
}

const LikeMovieButton: React.FC<LikeMovieButtonProps> = ({ movieId }) => {
  const session = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const queryKey = ["isLikedMovie", { movieId }];

  const { data: isLikedMovie } = useQuery({
    queryKey,
    queryFn: async () => {
      if (userId) {
        const { data } = await supabase
          .from("liked_movies")
          .select("movieId")
          .eq("userId", userId)
          .eq("movieId", movieId);
        return data?.length > 0;
      }
      return false;
    },
  });

  const { mutateAsync: likeMovieMutationFn } = useMutation({
    mutationFn: async (movieId: string | number) => {
      if (userId) {
        await supabase.from("liked_movies").insert([{ userId, movieId }]);
      }
    },
  });

  const { mutateAsync: unlikeMovieMutationFn } = useMutation({
    mutationFn: async (movieId: string | number) => {
      if (userId) {
        await supabase
          .from("liked_movies")
          .delete()
          .eq("userId", userId)
          .eq("movieId", movieId);
      }
    },
  });

  const handleClickLikeButton = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

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
      <span className="ml-2">{isLikedMovie ? "좋아요 취소" : "좋아요"}</span>
    </button>
  );
};

export default LikeMovieButton;
