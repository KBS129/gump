"use client";

import { useState } from "react";
import Backdrop from "@/components/Backdrop";
import { useId, useState } from "react"; // useState 추가
import Rating from "@/components/Rating"; // Rating 컴포넌트 임포트

function NewReviewModal() {
  const contentId = useId();
  const [content, setContent] = useState("");
  const { closeModal } = useModal();
  const params = useParams();

  const handleReviewSubmit = async () => {
    if (rating === 0 || !content) {
      alert("별점과 리뷰 내용을 모두 입력해주세요.");
      return;
    }

    const reviewData = {
      movie_id: params.movieId as string,
      rating,
      content,
    };


    const result = await createReview(reviewData);
    if (result) {
      alert("리뷰가 성공적으로 등록되었습니다.");
      closeModal(); // 모달 닫기
    } else {
      alert("리뷰 등록에 실패했습니다.");
    }
  
  const [clicked, setClicked] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]); // 별점 상태 관리

  const handleStarClick = (index: number) => {
    const newClicked = clicked.map((_, i) => i <= index); // 클릭한 별점 인덱스까지 true로 설정
    setClicked(newClicked);

  };

  return (
    <Backdrop>
      <div
        className="bg-black rounded-lg w-80 p-6 text-white border-white border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 별점 */}
        <div className="mb-10">
          <label className="text-sm font-bold inline-block mb-2">별점</label>
          <Rating clicked={clicked} onStarClick={handleStarClick} />{" "}
          {/* Rating 컴포넌트 사용 */}
        </div>

        {/* 리뷰 내용 */}
        <div className="mb-5">
          <label
            htmlFor={contentId}
            className="text-sm font-bold inline-block mb-2"
          >
            리뷰 내용
          </label>
          <textarea
            id={contentId}
            rows={10}
            className="w-full text-black p-4 outline-none rounded-md focus:ring-2 focus:ring-white outline focus:ring-offset-2 focus:ring-offset-slate-400 transition"
            placeholder="이곳에 리뷰를 작성해 주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 버튼 */}
        <button
          className="bg-red-600 text-white w-full font-bold rounded-md py-2.5 active:brightness-75 hover:brightness-90 transition"
          onClick={handleReviewSubmit}
        >
          리뷰 남기기
        </button>
      </div>
    </Backdrop>
  );
}

export default NewReviewModal;
