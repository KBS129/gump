import { BsStarFill } from "react-icons/bs";

function MovieReviewsList() {
  return (
    <div>
      <h5 className="text-white font-bold mb-10">
        이 영화에 대한 다양한 리뷰들을 확인해 보세요!
      </h5>

      <ul className="grid grid-cols-1 gap-y-6">
        <li className="flex items-start gap-x-4 ">
          {/* 별점 */}
          <div className="flex items-center gap-x-0.5 py-0.5">
            <BsStarFill className="text-sm text-yellow-300" />
            <BsStarFill className="text-sm text-yellow-300" />
            <BsStarFill className="text-sm text-yellow-300" />
            <BsStarFill className="text-sm text-white" />
            <BsStarFill className="text-sm text-white" />
          </div>

          {/* 리뷰 내용 */}
          <p className="text-white">
            학교 히어로과로 이어져 왔다. 유에이 2년 차 봄, 히어로 VS 빌런의
            전면전이 발발하고 황폐해진 사회에 수수께끼의 남자가 나타난다.
            스스로를 ‘올마이트를 대신하는 새로운 상징’이라고 말하는
            ‘다크마이트’는 자신의 야망을 위해 ‘개성’으로 거대한 요새를 만들어
            마을과 사람들을 차례로 삼켜간다! ‘다크마이트’의 등장과 동시에 특별한
            ‘개성’을 지닌 ‘안나’라는 소녀, 그리고{" "}
          </p>
        </li>
        <li className="flex items-start gap-x-4 ">
          {/* 별점 */}
          <div className="flex items-center gap-x-0.5 py-0.5">
            <BsStarFill className="text-sm text-yellow-300" />
            <BsStarFill className="text-sm text-yellow-300" />
            <BsStarFill className="text-sm text-yellow-300" />
            <BsStarFill className="text-sm text-white" />
            <BsStarFill className="text-sm text-white" />
          </div>

          {/* 리뷰 내용 */}
          <p className="text-white">
            학교 히어로과로 이어져 왔다. 유에이 2년 차 봄, 히어로 VS 빌런의
            전면전이 발발하고 황폐해진 사회에 수수께끼의 남자가 나타난다.
            스스로를 ‘올마이트를 대신하는 새로운 상징’이라고 말하는
            ‘다크마이트’는 자신의 야망을 위해 ‘개성’으로 거대한 요새를 만들어
            마을과 사람들을 차례로 삼켜간다! ‘다크마이트’의 등장과 동시에 특별한
            ‘개성’을 지닌 ‘안나’라는 소녀, 그리고{" "}
          </p>
        </li>

        <li className="flex items-start gap-x-4 ">
          {/* 별점 */}
          <div className="flex items-center gap-x-0.5 py-0.5">
            <BsStarFill className="text-sm text-yellow-300" />
            <BsStarFill className="text-sm text-yellow-300" />
            <BsStarFill className="text-sm text-yellow-300" />
            <BsStarFill className="text-sm text-white" />
            <BsStarFill className="text-sm text-white" />
          </div>

          {/* 리뷰 내용 */}
          <p className="text-white">
            학교 히어로과로 이어져 왔다. 유에이 2년 차 봄, 히어로 VS 빌런의
            전면전이 발발하고 황폐해진 사회에 수수께끼의 남자가 나타난다.
            스스로를 ‘올마이트를 대신하는 새로운 상징’이라고 말하는
            ‘다크마이트’는 자신의 야망을 위해 ‘개성’으로 거대한 요새를 만들어
            마을과 사람들을 차례로 삼켜간다! ‘다크마이트’의 등장과 동시에 특별한
            ‘개성’을 지닌 ‘안나’라는 소녀, 그리고{" "}
          </p>
        </li>
      </ul>
    </div>
  );
}

export default MovieReviewsList;
