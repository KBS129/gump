// src/lib/supabaseClient.ts
import { supabase } from "@/app/supabase"; // Supabase 클라이언트 경로

// 1. Supabase Auth를 이용한 회원가입
export const signUpUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error signing up user:", error.message);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Unexpected error occurred." };
  }
};

// 2. Supabase Auth를 이용한 로그인
export const signInWithSupabase = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Unexpected error occurred." };
  }
};

// 3. 현재 로그인된 사용자 정보 가져오기
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user:", error.message);
      return { success: false, message: error.message };
    }

    return { success: true, user: data.user };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Unexpected error occurred." };
  }
};

// 4. 로그아웃 처리
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Unexpected error occurred." };
  }
};

// 5. 영화 좋아요 상태 확인
export const checkIsLikedMovie = async (
  userId: string,
  movieId: string | number
) => {
  const { data, error } = await supabase
    .from("liked_movies")
    .select("movieId")
    .eq("userId", userId)
    .eq("movieId", movieId);

  if (error) throw new Error(error.message);
  return data?.length > 0; // 해당 movieId가 이미 존재하는지 확인
};

// 6. 좋아요 추가
export const likeMovie = async (userId: string, movieId: string | number) => {
  const { error } = await supabase
    .from("liked_movies")
    .insert([{ userId, movieId }]);
  if (error) throw new Error(error.message);
};

// 7. 좋아요 삭제
export const unlikeMovie = async (userId: string, movieId: string | number) => {
  const { error } = await supabase
    .from("liked_movies")
    .delete()
    .eq("userId", userId)
    .eq("movieId", movieId);

  if (error) throw new Error(error.message);
};

// 8. 좋아요 토글 함수
export const toggleLikeMovie = async (
  isLiked: boolean,
  userId: string,
  movieId: string | number
) => {
  if (isLiked) {
    // 이미 좋아요를 누른 경우, 좋아요 삭제
    await unlikeMovie(userId, movieId);
    return { success: true, message: "좋아요 삭제" };
  } else {
    // 좋아요를 누르지 않은 경우, 좋아요 추가
    await likeMovie(userId, movieId);
    return { success: true, message: "좋아요 추가" };
  }
};

// 9. 게시글 데이터 타입 정의
interface PostData {
  board_id: string; // 게시판 ID는 문자열로 정의
  content: string; // 게시글 내용
  movie_name: string; // 영화 이름
}

// 10. 게시글 생성 함수
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

// 11. 게시글 목록 가져오기 함수
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

// 12. 게시글 삭제 함수
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

// 13. 댓글 데이터 타입 정의
interface CommentData {
  post_id: number; // 게시글 ID
  author_id: string; // 작성자 ID
  content: string; // 댓글 내용
}

// 14. 댓글 생성 함수
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

// 15. 특정 게시글의 댓글 목록 가져오기 함수
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

// 16. 댓글 삭제 함수
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

// 17. 리뷰 데이터 타입 정의
interface ReviewData {
  user_id: string; // 작성자 ID
  movie_id: string | number; // 영화 ID
  rating: number; // 별점
  content: string; // 리뷰 내용
}

// 18. 리뷰 생성 함수
export const createReview = async (reviewData: ReviewData) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: reviewData.user_id,
        movie_id: reviewData.movie_id,
        rating: reviewData.rating,
        content: reviewData.content,
      })
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;	
  } catch (error) {
    console.error("리뷰 생성 중 오류 발생: ", error);
    return null;
  }
};

// 19. 특정 영화의 리뷰 목록 가져오기 함수
export const getReviewsByMovieId = async (movieId: string | number) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("movie_id", movieId)
      .order("createdAt", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("리뷰 가져오기 중 오류 발생:", error);
    return [];
  }
};

// 20. 리뷰 삭제 함수
export const deleteReview = async (reviewId: number) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("리뷰 삭제 중 오류 발생:", error);
    return null;
  }
};

export { supabase };
