"use client";

import React, { useState } from "react";
import { signInWithSupabase } from "@/api/supabase.api"; // Supabase 로그인 함수 import

// Props의 타입 정의
interface LoginModalProps {
  isOpen: boolean; // isOpen의 타입을 boolean으로 설정
  toggleModal: () => void; // toggleModal의 타입
  setIsLoggedIn: (loggedIn: boolean) => void; // setIsLoggedIn의 타입
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  toggleModal,
  setIsLoggedIn,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 로그인 처리 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Supabase를 사용해 로그인 시도
    const { success, message } = await signInWithSupabase(email, password);

    setLoading(false);

    if (success) {
      // 로그인 성공 시 상태 업데이트 및 모달 닫기
      setIsLoggedIn(true);
      toggleModal();
      window.location.href = "/"; // 로그인 후 홈페이지로 리다이렉션
    } else {
      // 로그인 실패 시 에러 메시지 설정
      setError(message || "알 수 없는 오류가 발생했습니다."); // 기본값 설정
      console.error(message);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-full h-full">
          <div className="bg-white rounded p-6 w-96 z-50">
            <h2 className="text-2xl text-black font-bold mb-4 text-center">
              로그인
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded p-2 text-black"
                required
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded p-2 text-black"
                required
              />
              {/* 에러 메시지 표시 */}
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                className="bg-black text-white hover:bg-slate-600 rounded p-2"
                disabled={loading}
              >
                {loading ? "로그인 중..." : "로그인하기"}
              </button>
              <button
                type="button"
                onClick={toggleModal}
                className="text-red-500 hover:scale-105 transition-transform"
              >
                취소
              </button>
              <div className="flex flex-col items-center space-y-2">
                <p className="text-black">아직 회원이 아니신가요?</p>
                <a
                  href="/sign-up"
                  className="text-lg text-red-500 hover:scale-105 transition-transform"
                >
                  회원가입하기
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
