import axios from "axios";

const tmdbBaseURL = "https://api.themoviedb.org";
const tmdbAccessToken =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjdiMTJjM2M2NjhiMjNjZThhNmNhMjFiYTE5M2JjYiIsIm5iZiI6MTcyNDgzMjQ5NC41NTE1NTMsInN1YiI6IjY1YTlkNjZjNTM0NjYxMDEzOGNkMTFhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rRVZwTNunIYGQ1-wPudD_JX_4KKTVWUSXtLP5Y4ARqs";
const tmdbClient = axios.create({
  baseURL: tmdbBaseURL,
  headers: { Authorization: tmdbAccessToken },
});

const jsonClient = axios.create({ baseURL: "http://localhost:3000" });

export const getMoviesOnCategory = async (category: string): Promise<Movie[]> => {
  const validCategories = ['popular', 'top_rated', 'now_playing'];
  
  if (!validCategories.includes(category)) {
    throw new Error(`유효하지 않은 카테고리: ${category}`);
  }

  const url = `/3/movie/${category}?language=ko-KR&page=1`;

  try {
    const response = await tmdbClient.get(url);
    const movies = response.data.results;
    return movies;
  } catch (error) {
    console.error("영화 가져오기 오류:", error);
    throw new Error("영화를 가져오는 데 실패했습니다.");
  }
};

export const getMovie = async (movieId: string | number): Promise<MovieDetail> => {
  const url = `/3/movie/${movieId}?language=ko-KR`;
  const response = await tmdbClient.get(url);
  console.log("영화 정보:", response.data);
  const movie = response.data;

  return movie;
};

export const likeMovie = async (movieId: string | number): Promise<LikedMovie> => {
  const url = "/likedMovies";
  const response = await jsonClient.post(url, { id: movieId });
  const likedMovie = response.data;

  return likedMovie;
};

export const unlikeMovie = async (movieId: string | number): Promise<LikedMovie> => {
  const url = `/likedMovies/${movieId}`;
  const response = await jsonClient.delete(url);
  const likedMovie = response.data;

  return likedMovie;
};

export const checkIsLikedMovie = async (movieId: string | number): Promise<boolean> => {
  try {
    const url = `likedMovies/${movieId}`;
    const response = await jsonClient.get(url);
    const likedMovie = response.data;
    const isLikedMovie = !!likedMovie;

    return isLikedMovie;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return false;
    }
    console.error("좋아요 영화 상태 확인 오류:", e);
    throw new Error("좋아요 영화 상태 확인 오류");
  }
};

export interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  tagline?: string;
  release_date: string;
  genres: { id: number; name: string }[];
  poster_path: string;
}

export interface LikedMovie {
  id: number;
}
