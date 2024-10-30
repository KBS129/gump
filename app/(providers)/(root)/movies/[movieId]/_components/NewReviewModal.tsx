import Backdrop from "@/components/Backdrop";
import { useId } from "react";
import { BsStarFill } from "react-icons/bs";

function NewReviewModal() {
  const contentId = useId();

  return (
    <Backdrop>
      <div
        className="bg-black rounded-lg w-80 p-6 text-white border-white border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 별점 */}
        <div className="mb-10">
          <label className="text-sm font-bold inline-block mb-2">별점</label>

          <div className="flex gap-x-2 mx-auto justify-center">
            <BsStarFill className="text-4xl text-yellow-300" />
            <BsStarFill className="text-4xl text-yellow-300" />
            <BsStarFill className="text-4xl text-yellow-300" />
            <BsStarFill className="text-4xl text-gray-700" />
            <BsStarFill className="text-4xl text-gray-700" />
          </div>
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
          />
        </div>

        {/* 버튼 */}
        <button className="bg-red-600 text-white w-full font-bold rounded-md py-2.5 active:brightness-75 hover:brightness-90 transition">
          리뷰 남기기
        </button>
      </div>
    </Backdrop>
  );
}

export default NewReviewModal;
