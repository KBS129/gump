"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";
import Header from "@/components/Header";

type Post = {
  id: string;
  board_id: string;
  movie_name: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  author_id: string;
};

const MyPage = () => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      // 현재 사용자 정보를 가져옴
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", user?.id); // user ID를 안전하게 가져옴

      if (error) {
        throw new Error(error.message);
      }

      setUserPosts(data as Post[]); // 데이터의 타입을 지정
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown error"; // 타입 안전성 확보
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts(); // 사용자 게시글 가져오기
  }, []); // 의존성 배열을 비워 사용자 게시글을 한 번만 가져옴

  return (
    <div className="bg-black">
      <Header />
      <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg mt-8 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          마이 페이지
        </h1>

        {loading && <p className="text-center">로딩 중...</p>}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {userPosts.length > 0 ? (
          <ul>
            {userPosts.map((post) => (
              <li key={post.id} className="mb-4">
                <h2 className="text-xl font-semibold">{post.movie_name}</h2>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">작성한 게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyPage;
