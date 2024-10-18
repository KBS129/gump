import axios, { AxiosError, AxiosResponse } from "axios";


const tmdbBaseURL = "https://api.themoviedb.org";
const tmdbApiKey = "91a57dbafda7b89f17fbb469feb78bb0"

const tmdbClient = axios.create({
  baseURL: tmdbBaseURL,
});

const jsonClient = axios.create({ baseURL: "http://localhost:3000" });

export const getMoviesOnCategory = async (category: string): Promise<Movie[]> => {
  const url = `/3/movie/${category}?language=ko-KR&page=1&api_key=${tmdbApiKey}`;
  
  const validCategories = ['popular', 'top_rated', 'now_playing'];
  if (!validCategories.includes(category)) {
    throw new Error(`Invalid category: ${category}`);
  }

  try {
    const response: AxiosResponse<{ results: Movie[] }> = await tmdbClient.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error); 
    throw error;
  }
};

export const getMovie = async (movieId: string | number): Promise<MovieDetail> => {
  const id = typeof movieId === 'string' ? Number(movieId) : movieId;
  const url = `/3/movie/${id}?language=ko-KR&api_key=${tmdbApiKey}`;
  const response: AxiosResponse<MovieDetail> = await tmdbClient.get(url);
  return response.data; 
};


export const likeMovie = async (movieId: string | number): Promise<LikedMovie> => {
  const id = typeof movieId === 'string' ? Number(movieId) : movieId;
  const url = "/likedMovies";
  const response: AxiosResponse<LikedMovie> = await jsonClient.post(url, { id });
  return response.data;
};

export const unlikeMovie = async (movieId: string | number): Promise<LikedMovie> => {
  const id = typeof movieId === 'string' ? Number(movieId) : movieId;
  const url = `/likedMovies/${id}`;
  const response: AxiosResponse<LikedMovie> = await jsonClient.delete(url);
  return response.data;
};

export const checkIsLikedMovie = async (movieId: string | number): Promise<boolean> => {
  const id = typeof movieId === 'string' ? Number(movieId) : movieId;

  try {
    const url = `likedMovies/${id}`;
    const response: AxiosResponse<LikedMovie> = await jsonClient.get(url);
    return !!response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response?.status === 404) {
      return false; 
    }
    throw e;
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
}

export interface LikedMovie {
  id: number;
}
