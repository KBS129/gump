import React from "react";
import { AiFillStar } from "react-icons/ai";

interface RatingProps {
  clicked: boolean[];
  onStarClick: (index: number) => void;
}

const Rating = ({ clicked, onStarClick }: RatingProps) => {
  const starArray = [0, 1, 2, 3, 4];
  const rating = clicked.filter(Boolean).length;

  return (
    <div className="flex pt-1.5">
      {starArray.map((el) => (
        <AiFillStar
          fontSize={40}
          key={el}
          onClick={() => onStarClick(el)} // 'el'을 사용하도록 변경
          className={`${
            clicked[el] ? "text-yellow-400" : "text-gray-400"
          } cursor-pointer hover:text-yellow-400`}
        />
      ))}
      <p className="ml-2 text-lg font-semibold">
        {rating === 5
          ? "5.0"
          : rating === 4
          ? "4.0"
          : rating === 3
          ? "3.0"
          : rating === 2
          ? "2.0"
          : rating === 1
          ? "1.0"
          : "0.0"}
      </p>
    </div>
  );
};

export default Rating;
