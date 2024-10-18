'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/supabase";

const EditPostPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>(""); // 게시글 내용 상태

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
        setContent(data.content); // 기존 게시글 내용으로 상태 설정
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost(); // ID가 있을 때만 호출
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    try {
      const { error } = await supabase
        .from("posts")
        .update({ content }) // 수정된 내용으로 게시글 업데이트
        .eq("id", id);

      if (error) throw error;

      router.push(`/posts/${id}`); // 수정 완료 후 게시글 상세 페이지로 이동
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <p className="text-blue-500">로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold mb-6">게시글 수정</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <div className="mt-4 flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              저장
            </button>
            <button
              onClick={() => router.back()}
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
