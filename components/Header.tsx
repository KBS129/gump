"use client";

import Link from "next/link";
import LoginModal from "./LoginModal";
import { useEffect, useState } from "react";
import { getCurrentUser, signOutUser } from "@/api/supabase.api";
import { useRouter } from "next/navigation";

function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const manageOverflow = () => {
      if (isOpen) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      } else {
        document.documentElement.style.overflow = "auto";
        document.body.style.overflow = "auto";
      }
    };
    manageOverflow();
  }, [isOpen]);

  const checkUserLoggedIn = async () => {
    const { success } = await getCurrentUser();
    setIsLoggedIn(success);
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const handleLogout = async () => {
    const { success, message } = await signOutUser();
    if (success) {
      setIsLoggedIn(false);
      router.push("/");
    } else {
      console.error(message);
    }
  };

  return (
    <header className="flex items-center p-4 border-b">
      <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#80FF72] to-[#7EE8FA] bg-clip-text text-transparent font-cafe24">
        <Link href="/">gump</Link>
      </h1>
      <nav className="flex items-center space-x-2 sm:space-x-4 ml-4">
        <Link href="/posts" className="text-base sm:text-lg">
          자유 게시판
        </Link>
      </nav>
      <nav className="ml-auto flex items-center space-x-2 sm:space-x-4">
        {isLoggedIn ? (
          <>
            <Link href="/mypage" className="text-base sm:text-lg">
              마이페이지
            </Link>
            <button onClick={handleLogout} className="text-base sm:text-lg">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/sign-up" className="text-base sm:text-lg">
              회원가입
            </Link>
            <button onClick={toggleModal} className="text-base sm:text-lg">
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
