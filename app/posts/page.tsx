"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/supabase";
import Header from "@/components/Header";
import LoginModal from "@/components/LoginModal"; // 로그인 모달 컴포넌트 임포트

const POSTS_PER_PAGE = 5;

const PostsPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false); // 로그인 모달 상태
  const [user, setUser] = useState<any>(null); // 로그인된 사용자 정보

  // 로그인 상태 확인
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const { data: topData, error: topError } = await supabase
          .from("posts")
          .select("*")
          .order("views", { ascending: false })
          .limit(10);

        if (topError) throw topError;

        const shuffledPosts = topData.sort(() => Math.random() - 0.5);
        setTopPosts(shuffledPosts || []);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchTopPosts();
  }, [posts]);

  const handlePostClick = async (postId: number) => {
    try {
      const { error } = await supabase.rpc("increment_views", {
        post_id: postId,
      });

      if (error) throw error;

      setTopPosts((prevTopPosts) =>
        prevTopPosts.map((post) =>
          post.id === postId ? { ...post, views: post.views + 1 } : post
        )
      );

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

  // 로그인 여부 확인 후 새 글 작성 페이지 이동 또는 로그인 모달 표시
  const handleNewPostClick = () => {
    if (user) {
      window.location.href = "/posts/new";
    } else {
      setShowLoginModal(true); // 모달을 표시
    }
  };

  // 모달 열고 닫기 토글 함수
  const toggleModal = () => setShowLoginModal(!showLoginModal);

  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    setTotalPages(Math.ceil(posts.length / POSTS_PER_PAGE));
  }, [posts]);

  if (loading) return <p className="text-blue-500">로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-50 overflow-hidden relative">
        {/* 가운데 게시글 목록 */}
        <div className="flex-1 p-6 md:p-8 relative z-10">
          <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
            게시글 목록
          </h1>
          <button
            className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            onClick={handleNewPostClick}
          >
            새 글 작성
          </button>

          {paginatedPosts.length === 0 ? (
            <p className="text-gray-500 text-lg">게시글이 없습니다.</p>
          ) : (
            <ul className="w-full max-w-3xl space-y-4">
              {paginatedPosts.map((post) => (
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

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-6 space-x-4">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-blue-600"
                } hover:bg-blue-700 hover:text-white transition duration-200`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 오른쪽 사이드바: 가장 많이 조회된 게시물 */}
        <div className="hidden md:block w-1/4 bg-white p-6 shadow-md rounded-lg z-10">
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
                    <p className="text-sm text-gray-500">
                      조회수: {post.views}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
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
      <LoginModal isOpen={showLoginModal} toggleModal={toggleModal} />
    </>
  );
};

export default PostsPage;
