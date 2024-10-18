"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/supabase";

const NewPost = () => {
  const [boardId, setBoardId] = useState(""); // board_id 입력 상태로 관리
  const [movieName, setMovieName] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null); // 이미지 또는 동영상 파일 상태로 관리
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      let imageUrl = null;
      let videoUrl = null;

      // 파일이 있다면 Supabase 스토리지에 업로드
      if (file) {
        const fileExtension = file.name.split(".").pop();
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        let path;
        if (isImage) {
          path = `images/${Date.now()}_${file.name}`;
        } else if (isVideo) {
          path = `videos/${Date.now()}_${file.name}`;
        }

        if (path) {
          const { data, error: uploadError } = await supabase.storage
            .from("media")
            .upload(path, file);

          if (uploadError) throw uploadError;

          const publicUrl = supabase.storage
            .from("media")
            .getPublicUrl(data.path).data.publicUrl;

          if (isImage) {
            imageUrl = publicUrl;
          } else if (isVideo) {
            videoUrl = publicUrl;
          }
        }
      }

      // 게시글을 Supabase 데이터베이스에 추가
      const { error: postError } = await supabase.from("posts").insert({
        board_id: boardId, // board_id 추가
        movie_name: movieName,
        content: content,
        image_url: imageUrl,
        video_url: videoUrl,
      });

      if (postError) throw postError;

      // 성공 시 메인 페이지로 이동
      router.push("/posts");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg mt-8 max-w-2xl">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        새 게시글 작성
      </h1>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            게시판 ID
          </label>
          <input
            type="text"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            placeholder="게시판 ID를 입력하세요"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            영화 이름
          </label>
          <input
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            placeholder="영화 이름을 입력하세요"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            rows={4}
            placeholder="내용을 입력하세요"
            required
          ></textarea>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            파일 업로드
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="p-3 border border-gray-300 rounded-lg w-full cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "게시글 업로드 중..." : "게시글 작성"}
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
            onClick={() => router.back()} // 취소 버튼 클릭 시 이전 페이지로 이동
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;
