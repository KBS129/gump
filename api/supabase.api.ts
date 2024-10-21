// api/apiService.ts
import { supabase } from "@/app/supabase";

// 1. 회원가입 API (users 테이블에 사용자 삽입)
export const signUpUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: email,
          password: password,
        },
      ])
      .select("*");

    if (error) {
      console.error("Error signing up user:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data: data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Unexpected error occurred." };
  }
};

// 2. 게시글 데이터 타입 정의
interface PostData {
  board_id: string; // 게시판 ID는 문자열로 정의
  content: string; // 게시글 내용
  movie_name: string; // 영화 이름
}

// 3. 댓글 데이터 타입 정의
interface CommentData {
  post_id: number; // 게시글 ID
  author_id: string; // 작성자 ID
  content: string; // 댓글 내용
}

// 4. 게시글 생성 함수
export const createPost = async (postData: PostData) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        board_id: postData.board_id,
        content: postData.content,
        movie_name: postData.movie_name,
      })
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("게시글 생성 중 오류 발생: ", error);
    return null;
  }
};

// 5. 게시글 목록 가져오기 함수
export const getPosts = async () => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("게시글 가져오기 중 오류 발생:", error);
    return null;
  }
};

// 6. 게시글 삭제 함수
export const deletePost = async (postId: number) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    return null;
  }
};

// 7. 댓글 생성 함수
export const createComment = async (commentData: CommentData) => {
  try {
    const { data, error } = await supabase.from("comments").insert({
      post_id: commentData.post_id,
      author_id: commentData.author_id,
      content: commentData.content,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("댓글 생성 중 오류 발생: ", error);
    return null;
  }
};

// 8. 특정 게시글의 댓글 목록 가져오기 함수
export const getCommentsByPostId = async (postId: number) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("댓글 가져오기 중 오류 발생:", error);
    return null;
  }
};

// 9. 댓글 삭제 함수
export const deleteComment = async (commentId: number) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("댓글 삭제 중 오류 발생:", error);
    return null;
  }
};

