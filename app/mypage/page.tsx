// components/MyPage.tsx

"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/api/supabase.api"; // 사용자 정보 가져오기
import { getPosts } from "@/api/supabase.api"; // 게시글 가져오기
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

function MyPage() {
  const router = useRouter(); // useRouter 훅 사용
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const { success, user } = await getCurrentUser();
      if (success) {
        setUser(user);
        fetchUserPosts(user.id); // 사용자 ID로 게시글 가져오기
      } else {
        // 로그인하지 않은 경우 로그인 페이지로 리다이렉션
        router.push("/login"); // 로그인 페이지로 이동
      }
    };

    fetchUserData();
  }, [router]); // router를 의존성 배열에 추가

  // 사용자가 작성한 게시글 가져오기
  const fetchUserPosts = async (userId: string) => {
    const allPosts = await getPosts(); // 모든 게시글 가져오기
    const userPosts = allPosts.filter((post) => post.author_id === userId); // 작성한 게시글 필터링
    setPosts(userPosts);
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          마이페이지
        </h2>
        {user ? (
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-2xl font-semibold text-gray-700">
              사용자 정보
            </h3>
            <p className="text-lg text-gray-600">이메일: {user.email}</p>
            {/* 다른 사용자 정보가 있으면 추가로 표시 */}

            <h3 className="text-2xl font-semibold text-gray-700 mt-6">
              내가 쓴 게시글
            </h3>
            {posts.length > 0 ? (
              <ul className="mt-4">
                {posts.map((post) => (
                  <li key={post.id} className="border-b py-4">
                    <h4 className="font-semibold text-lg text-blue-600">
                      {post.movie_name}
                    </h4>
                    <p className="text-gray-600">{post.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-500">작성한 게시글이 없습니다.</p>
            )}
          </div>
        ) : (
          <p className="text-lg text-red-500">로그인 상태가 아닙니다.</p>
        )}
      </div>
    </>
  );
}

export default MyPage;
