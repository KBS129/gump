"use client";

import Link from "next/link";
import LoginModal from "./LoginModal";
import { useEffect, useState } from "react";
import { getCurrentUser, signOutUser } from "@/api/supabase.api"; // 현재 사용자 정보 및 로그아웃 함수 import

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
  const [userEmail, setUserEmail] = useState(""); // 사용자 이메일 상태

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // 현재 로그인 상태 확인
  const checkUserLoggedIn = async () => {
    const { success, user } = await getCurrentUser();
    if (success) {
      setIsLoggedIn(true);
      setUserEmail(user.email); // 이메일 상태 업데이트
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn(); // 컴포넌트가 마운트될 때 로그인 상태 확인
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    const { success, message } = await signOutUser(); // 로그아웃 호출
    if (success) {
      setIsLoggedIn(false); // 로그인 상태 초기화
      setUserEmail(""); // 사용자 이메일 초기화
    } else {
      console.error(message); // 로그아웃 실패 시 에러 출력
    }
  };

  return (
    <header className="flex items-center p-4 border-b">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#80FF72] to-[#7EE8FA] bg-clip-text text-transparent font-cafe24">
        <Link href="/">gump</Link>
      </h1>

      <nav className="flex items-center space-x-4 ml-4">
        <Link href="/posts" className="text-lg">
          자유 게시판
        </Link>
      </nav>
      <nav className="ml-auto flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link href="/mypage" className="text-lg">
              마이페이지
            </Link>
            <button onClick={handleLogout} className="text-lg">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/sign-up" className="text-lg">
              회원가입
            </Link>
            <button onClick={toggleModal} className="text-lg">
              로그인
            </button>
          </>
        )}
      </nav>
      <LoginModal
        isOpen={isOpen}
        toggleModal={toggleModal}
        setIsLoggedIn={setIsLoggedIn}
      />
    </header>
  );
}

export default Header;
