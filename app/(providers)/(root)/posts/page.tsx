"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/supabase";
import Header from "@/components/Header";
import LoginModal from "@/components/LoginModal";

const POSTS_PER_PAGE = 5;

type Post = {
  id: number;
  title: string;
  content: string;
  movie_name: string;
  created_at: string;
  views: number;
};

type User = {
  email: string | null; // Allow email to be null
} | null;

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [topPosts, setTopPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ? { email: user.email || null } : null); // email이 undefined일 경우 null로 설정
      setIsLoggedIn(!!user);
    };

    checkUser();
  }, []);

  // 게시글 목록 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // 로딩 상태 초기화
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        setError((error as { message?: string }).message || "Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 가장 많이 조회된 게시물 불러오기
  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const { data: topData, error: topError } = await supabase
          .from("posts")
          .select("*")
          .order("views", { ascending: false }) // 조회수를 기준으로 내림차순 정렬
          .limit(10);

        if (topError) throw topError;

        setTopPosts(topData || []); // 정렬된 데이터를 사용
      } catch (error) {
        setError((error as { message?: string }).message || "Error fetching top posts");
      }
    };

    fetchTopPosts();
  }, [posts]);

  // 게시글 클릭 시 조회수 증가
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
    } catch (error) {
      setError((error as { message?: string }).message || "Error incrementing views");
    }
  };

  const handleNewPostClick = () => {
    if (isLoggedIn) {
      window.location.href = "/posts/new";
    } else {
      setShowLoginModal(true);
    }
  };

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
      <div className="flex min-h-screen bg-black text-white overflow-hidden relative">
        <div className="flex-1 p-6 md:p-8 relative z-10">
          <h1 className="text-4xl font-extrabold mb-8 text-white">게시글 목록</h1>
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
                    <h2 className="font-bold text-2xl text-blue-400 hover:underline">
                      {post.movie_name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-4">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {isLoggedIn && user && (
            <p className="text-green-500">환영합니다, {user.email}님!</p>
          )}

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

        <div className="hidden md:block w-1/4 bg-white p-6 shadow-md rounded-lg z-10">
          <h2 className="text-xl font-bold mb-4 text-black">가장 많이 조회된 게시물</h2>
          {topPosts.length === 0 ? (
            <p className="text-gray-500 text-sm">게시물이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {topPosts.map((post) => (
                <li key={post.id}>
                  <Link href={`/posts/${post.id}`}>
                    <h3 className="font-bold text-lg text-blue-400 hover:underline">
                      {post.movie_name}
                    </h3>
                    <p className="text-sm text-black">조회수: {post.views}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <LoginModal
        isOpen={showLoginModal}
        toggleModal={toggleModal}
        setIsLoggedIn={setIsLoggedIn} // Pass setIsLoggedIn prop
      />
    </>
  );
};

export default PostsPage;
