import { create } from "zustand";

// store/postStore.ts
interface Post {
  id: string;
  movie_name: string;
  content: string;
  author_id: string;
}

interface PostState {
  posts: Post[];
  addPost: (post: Post) => void;
  setPosts: (posts: Post[]) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  setPosts: (posts) => set({ posts }),
}));
