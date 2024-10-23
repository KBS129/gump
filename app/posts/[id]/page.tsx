"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/supabase"; // Supabase 클라이언트 import
import Header from "@/components/Header";
import { deletePost } from "@/api/supabase.api";

const PostDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState("");

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
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(user);
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, author_id:users(id, username)") // users 테이블에서 username 가져오기
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
      // 로컬 스토리지에 댓글 저장
      localStorage.setItem(`comments-${id}`, JSON.stringify(data || []));
    };

    if (id) {
      fetchPost();
      fetchComments();
    }
    fetchUser();

    // 댓글이 로컬 스토리지에 있으면 상태에 설정
    const savedComments = localStorage.getItem(`comments-${id}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }

    // 게시글 테이블에 대한 실시간 구독 설정
    const channel = supabase.channel("realtime:posts");
    channel
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload) => {
          if (payload.new.id === id) {
            setPost(payload.new);
          }
        }
      )
      .subscribe();

    // 댓글 테이블에 대한 실시간 구독 설정
    const commentsChannel = supabase
      .channel("realtime:comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => {
          if (payload.new.post_id === id) {
            // 새로운 댓글을 상태에 추가
            setComments((prevComments) => {
              const updatedComments = [payload.new, ...prevComments];
              // 로컬 스토리지에 업데이트
              localStorage.setItem(
                `comments-${id}`,
                JSON.stringify(updatedComments)
              );
              return updatedComments;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(commentsChannel);
    };
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      return alert("댓글 내용을 입력하세요.");
    }

    try {
      const commentData = {
        post_id: id,
        author_id: user.id,
        content: commentContent,
      };

      // 댓글 데이터 삽입
      const { error } = await supabase.from("comments").insert([commentData]);
      if (error) throw error;

      // 새 댓글을 comments 상태에 추가
      setComments((prevComments) => {
        const updatedComments = [
          {
            ...commentData,
            id: Date.now(), // 임시 ID (데이터베이스에서 생성된 ID를 사용하지 않음)
            created_at: new Date().toISOString(), // 현재 시간으로 생성
          },
          ...prevComments,
        ];
        // 로컬 스토리지에 업데이트
        localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
        return updatedComments;
      });

      setCommentContent(""); // 댓글 작성 후 초기화
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeletePost = async () => {
    if (confirm("정말로 게시글을 삭제하시겠습니까?")) {
      try {
        await deletePost(Number(id));
        if (error) throw error;

        // 게시글 삭제 후 알림 표시
        alert("게시글이 삭제되었습니다.");
        router.push("/posts"); // 삭제 후 목록으로 이동
      } catch (error: any) {
        // 에러 발생 시 알림 표시
        alert(`게시글 삭제에 실패했습니다: ${error.message}`);
        setError(error.message);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (confirm("정말로 댓글을 삭제하시겠습니까?")) {
      try {
        const { error } = await supabase
          .from("comments")
          .delete()
          .eq("id", commentId)
          .eq("author_id", user.id); // 댓글 작성자와 현재 로그인한 유저를 비교

        if (error) throw error;

        // 삭제된 댓글 제외하고 상태 업데이트
        setComments((prevComments) => {
          const updatedComments = prevComments.filter(
            (comment) => comment.id !== commentId
          );
          // 로컬 스토리지에 업데이트
          localStorage.setItem(
            `comments-${id}`,
            JSON.stringify(updatedComments)
          );
          return updatedComments;
        });
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const handleEditPost = () => {
    if (user && user.id === post.author_id) {
      router.push(`/posts/edit/${post.id}`);
    } else {
      alert("본인이 작성한 게시글만 수정할 수 있습니다.");
    }
  };

  if (loading) return <p className="text-blue-500">로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Header />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-semibold mb-6">{post.movie_name}</h1>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <p className="text-gray-700 mb-4">{post.content}</p>
          <p className="text-sm text-gray-500">
            작성일: {new Date(post.created_at).toLocaleDateString()}
          </p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.movie_name}
              className="w-full h-64 object-cover mb-4 rounded-lg"
            />
          )}

          {post.video_url && (
            <video
              src={post.video_url}
              controls
              className="w-full h-64 object-cover mb-4 rounded-lg"
            />
          )}

          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
            >
              목록으로 돌아가기
            </button>

            {user && user.id === post.author_id && (
              <>
                <button
                  onClick={handleEditPost}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
                >
                  수정
                </button>

                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
                >
                  삭제
                </button>
              </>
            )}

            {user && user.id !== post.author_id && (
              <p className="text-sm text-red-500">
                본인이 작성한 게시글만 수정 및 삭제할 수 있습니다.
              </p>
            )}
          </div>
        </div>

        {/* 댓글 표시 부분 */}
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">댓글</h2>

          {comments.length === 0 ? (
            <p className="text-gray-600">댓글이 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    작성자: {comment.author_id.username || "익명"} |{" "}
                    {new Date(comment.created_at).toLocaleString()}
                  </p>

                  {user && user.id === comment.author_id.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 text-sm"
                    >
                      삭제
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* 댓글 작성 폼 */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mt-4 flex">
              <input
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="댓글을 입력하세요..."
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition"
              >
                작성
              </button>
            </form>
          ) : (
            <p className="text-gray-600">
              로그인 후 댓글을 작성할 수 있습니다.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PostDetailPage;
