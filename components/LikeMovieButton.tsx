"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaHeart } from "react-icons/fa";
import { supabase } from "@/app/supabase"; // Supabase 클라이언트 경로
import { checkIsLikedMovie, toggleLikeMovie } from "@/api/supabase.api"; // API 함수 경로

interface LikeMovieButtonProps {
  movieId: string | number;
}

const LikeMovieButton: React.FC<LikeMovieButtonProps> = ({ movieId }) => {
  const queryClient = useQueryClient();
  const queryKey: readonly [string, string] = [
    "isLikedMovie",
    movieId.toString(),
  ]; // readonly로 설정
  const [userId, setUserId] = useState<string | null>(null);

  // 사용자 ID 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };

    fetchUser();
  }, []);

  // 현재 좋아요 상태 조회
  const { data: isLiked = false } = useQuery({
    queryKey,
    queryFn: async () => {
      if (userId) {
        return await checkIsLikedMovie(userId, movieId);
      }
      return false;
    },
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
  });

  // 좋아요 추가 및 삭제 함수
  const { mutateAsync: toggleLikeMutation } = useMutation({
    mutationFn: async ({ isLiked }: { isLiked: boolean }) => {
      if (userId) {
        return await toggleLikeMovie(isLiked, userId, movieId); // 좋아요 상태 토글
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isLikedMovie", movieId] }); // 쿼리 무효화하여 최신 데이터 반영
    },
    onError: (error) => {
      alert(error.message); // 사용자에게 오류 메시지 표시
    },
  });

  // 버튼 클릭 처리
  const handleClickLikeButton = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 현재 좋아요 상태에 따라 데이터 추가 또는 삭제
    await toggleLikeMutation({ isLiked }); // 데이터 추가 또는 삭제
  };

  return (
    <button
      onClick={handleClickLikeButton}
      className={`border-white/20 p-4 rounded-full border-2 bg-white/20 ${
        isLiked ? "bg-red-500 text-white" : "!text-white/70"
      } active:brightness-50 transition`}
    >
      <FaHeart
        className={`text-4xl transition ${
          isLiked ? "text-red-500" : "text-white"
        }`}
      />
    </button>
  );
};

export default LikeMovieButton;
