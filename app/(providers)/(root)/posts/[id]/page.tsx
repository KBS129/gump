"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/supabase"; // Supabase 클라이언트 import
import Header from "@/components/Header";
import { deletePost } from "@/api/supabase.api";
import Image from "next/image"; // Image 컴포넌트 import

type Post = {
  id: number;
  title: string;
  content: string;
  movie_name: string;
  created_at: string;
  views: number;
  image_url?: string; // 추가된 이미지 URL 필드
  video_url?: string; // 추가된 비디오 URL 필드
  author_id: string; // 작성자 ID 추가
};

type User = {
  id: string;
  username?: string; // 선택적으로 변경
};

type Comment = {
  id: number;
  content: string;
  created_at: string;
  post_id: number;
  author_id: User; // User 타입으로 설정
};

const PostDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState<string>("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single<Post>();

        if (error) throw error;

        setPost(data);
      } catch (error) {
        setError((error as Error).message);
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
      setUser(user as User); // User 타입으로 설정
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, author_id:users(id, username)")
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments((data as Comment[]) || []); // Comment 타입으로 설정
      localStorage.setItem(`comments-${id}`, JSON.stringify(data || []));
    };

    if (id) {
      fetchPost();
      fetchComments();
    }
    fetchUser();

    const savedComments = localStorage.getItem(`comments-${id}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }

    const channel = supabase.channel("realtime:posts");
    channel
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload: { new: Post }) => {
          // payload의 타입을 Post로 설정
          if (payload.new.id === Number(id)) {
            // id를 Number로 변환
            setPost(payload.new);
          }
        }
      )
      .subscribe();

    const commentsChannel = supabase
      .channel("realtime:comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload: { new: Comment }) => {
          // payload의 타입을 Comment로 설정
          if (payload.new.post_id === Number(id)) {
            // id를 Number로 변환
            setComments((prevComments) => {
              const updatedComments = [payload.new, ...prevComments];
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
      const commentData: Comment = {
        id: Date.now(), // 임시 ID (데이터베이스에서 생성된 ID를 사용하지 않음)
        post_id: Number(id),
        author_id: { id: user!.id }, // User 타입으로 설정
        content: commentContent,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("comments").insert([commentData]);
      if (error) throw error;

      setComments((prevComments) => {
        const updatedComments = [commentData, ...prevComments];
        localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
        return updatedComments;
      });

      setCommentContent("");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleDeletePost = async () => {
    if (confirm("정말로 게시글을 삭제하시겠습니까?")) {
      try {
        await deletePost(Number(id));
        alert("게시글이 삭제되었습니다.");
        router.push("/posts");
      } catch (error) {
        alert(`게시글 삭제에 실패했습니다: ${(error as Error).message}`);
        setError((error as Error).message);
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
          .eq("author_id", user!.id);

        if (error) throw error;

        setComments((prevComments) => {
          const updatedComments = prevComments.filter(
            (comment) => comment.id !== commentId
          );
          localStorage.setItem(
            `comments-${id}`,
            JSON.stringify(updatedComments)
          );
          return updatedComments;
        });
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  const handleEditPost = () => {
    if (user && user.id === post?.author_id) {
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
      <div className="flex flex-col items-center min-h-screen bg-black p-4">
        <h1 className="text-3xl font-semibold mb-6 text-white">
          {post?.movie_name}
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <p className="text-gray-700 mb-4">{post?.content}</p>
          <p className="text-sm text-gray-500">
            작성일: {new Date(post?.created_at || "").toLocaleDateString()}
          </p>

          {post?.image_url && (
            <Image
              src={post.image_url}
              alt={post.movie_name}
              width={500} // 원하는 너비
              height={300} // 원하는 높이
              className="w-full h-64 object-cover mb-4 rounded-lg"
            />
          )}

          {post?.video_url && (
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

            {user && user.id === post?.author_id && (
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

            {user && user.id !== post?.author_id && (
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
              >
                삭제
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4">댓글</h2>
          <form onSubmit={handleCommentSubmit} className="flex">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="flex-1 p-2 border border-gray-300 rounded-l-md"
            />
            <button
              type="submit"
              className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition"
            >
              등록
            </button>
          </form>

          {comments.length === 0 ? (
            <p className="text-gray-500">댓글이 없습니다.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex justify-between items-center bg-gray-200 p-2 my-2 rounded-md"
              >
                <div>
                  <span className="font-semibold">
                    {comment.author_id.username}
                  </span>
                  <p>{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
                {user && user.id === comment.author_id.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default PostDetailPage;
