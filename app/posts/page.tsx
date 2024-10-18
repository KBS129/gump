"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/supabase";

const PostsPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPosts(data || []);

        const { data: topData, error: topError } = await supabase
          .from("posts")
          .select("*")
          .order("views", { ascending: false })
          .limit(5);

        if (topError) throw topError;
        setTopPosts(topData || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = async (postId: number) => {
    console.log(1);
    try {
      // 조회수 증가 처리
      const { error } = await supabase.rpc("increment_views", {
        post_id: postId,
      });

      if (error) throw error;

      // 조회수 증가 후 상위 조회수 게시물 업데이트
      setTopPosts((prevTopPosts) =>
        prevTopPosts.map((post) =>
          post.id === postId ? { ...post, views: post.views + 1 } : post
        )
      );

      // 전체 게시물 데이터도 재가져오기
      const { data: updatedPosts, error: fetchError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setPosts(updatedPosts || []);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <p className="text-blue-500">로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* 왼쪽 사이드바 */}
      <div className="hidden md:block w-1/5 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-5 text-gray-800">사용자 메뉴</h2>
        <Link href="/login">
          <button className="w-full mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
            로그인
          </button>
        </Link>
        <Link href="/register">
          <button className="w-full mb-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105">
            회원가입
          </button>
        </Link>
      </div>

      {/* 가운데 게시글 목록 */}
      <div className="flex-1 p-6 md:p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
          게시글 목록
        </h1>
        <Link href="/posts/new">
          <button className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
            새 글 작성
          </button>
        </Link>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-lg">게시글이 없습니다.</p>
        ) : (
          <ul className="w-full max-w-3xl space-y-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white hover:shadow-xl transition transform hover:scale-105"
              >
                <Link
                  href={`/posts/${post.id}`}
                  onClick={() => handlePostClick(post.id)}
                >
                  <h2 className="font-bold text-2xl text-blue-600 hover:underline">
                    {post.movie_name}
                  </h2>
                  <p className="text-gray-700 text-base mt-2">
                    {post.content.length > 150
                      ? `${post.content.substring(0, 150)}...`
                      : post.content}
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 오른쪽 사이드바: 가장 많이 조회된 게시물 */}
      <div className="hidden md:block w-1/5 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">가장 많이 조회된 게시물</h2>
        {topPosts.length === 0 ? (
          <p className="text-gray-500 text-sm">게시물이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {topPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/posts/${post.id}`}>
                  <h3 className="font-bold text-lg text-blue-600 hover:underline">
                    {post.movie_name}
                  </h3>
                  <p className="text-sm text-gray-500">조회수: {post.views}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
