"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/api/supabase.api";
import { getPosts } from "@/api/supabase.api";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { usePostStore } from "@/store/PostsStore";

function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const posts = usePostStore((state) => state.posts); // Zustand에서 posts 가져오기
  const setPosts = usePostStore((state) => state.setPosts); // Zustand에서 setPosts 액션 가져오기

  useEffect(() => {
    const fetchUserData = async () => {
      const { success, user } = await getCurrentUser();
      if (success) {
        setUser(user);
        fetchUserPosts(user.id); // 사용자 ID로 게시글 가져오기
      } else {
        router.push("/login"); // 로그인 페이지로 이동
      }
    };

    fetchUserData();
  }, [router]);

  const fetchUserPosts = async (userId: string) => {
    const allPosts = await getPosts();
    const userPosts = allPosts
      ? allPosts.filter((post) => post.author_id === userId)
      : [];
    setPosts(userPosts); // Zustand 상태에 게시글 설정
  };

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${postId}`); // 게시글 상세 페이지로 이동
  };

  return (
    <>
      <div className="bg-black text-white">
        <Header />
        <div className="p-6 min-h-screen bg-black text-white">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">
            마이페이지
          </h2>
          {user ? (
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-2xl font-semibold text-gray-700">
                사용자 정보
              </h3>
              <p className="text-lg text-gray-600">이메일: {user.email}</p>

              <h3 className="text-2xl font-semibold text-gray-700 mt-6">
                내가 쓴 게시글
              </h3>
              {posts && posts.length > 0 ? (
                <ul className="mt-4">
                  {posts.map(
                    (post) =>
                      post && (
                        <li
                          key={post.id}
                          className="border-b py-4 cursor-pointer hover:bg-gray-200"
                          onClick={() => handlePostClick(post.id)} // 게시글 클릭 이벤트 추가
                        >
                          <h4 className="font-semibold text-lg text-blue-600">
                            {post.movie_name || "제목 없음"}
                          </h4>
                          <p className="text-gray-600">
                            {post.content || "내용 없음"}
                          </p>
                        </li>
                      )
                  )}
                </ul>
              ) : (
                <p className="mt-4 text-gray-500">작성한 게시글이 없습니다.</p>
              )}
            </div>
          ) : (
            <p className="text-lg text-red-500">로그인 상태가 아닙니다.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default MyPage;
