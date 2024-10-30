"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/supabase";

const EditPostPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movieName, setMovieName] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setPost(data);
        setMovieName(data.movie_name);
        setContent(data.content);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("posts")
        .update({ movie_name: movieName, content })
        .eq("id", id);

      if (error) throw error;

      // 수정 후 상세 페이지로 리디렉션
      router.push(`/posts/${id}`);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <p className="text-blue-500">로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-black p-4">
      <h1 className="text-3xl font-semibold mb-6 text-white">게시글 수정</h1>
      <form
        onSubmit={handleUpdatePost}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl"
      >
        <div className="mb-4">
          <label htmlFor="movie-name" className="block mb-1">
            영화 제목
          </label>
          <input
            type="text"
            id="movie-name"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-1">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
