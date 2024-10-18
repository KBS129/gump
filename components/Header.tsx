"use client";

import Link from 'next/link';
import LoginModal from './LoginModal';
import { useEffect, useState } from 'react';

function Header() {

  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };


  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden'; 
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto'; 
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  
  

  return (
    <header className="flex items-center p-4 border-b">
    <h1 className="text-3xl font-bold no-underline text-blue-500">
      <Link href="/main">Gump</Link>
    </h1>
    <nav className="flex items-center space-x-4 ml-4" >
      <Link href="/board" className="text-lg">자유 게시판</Link>
    </nav>
    <nav className="ml-auto flex items-center space-x-4">
      <Link href="/sign-up" className="text-lg">회원가입</Link>
      <button onClick={toggleModal} className="text-lg">로그인</button>
    </nav>
      <LoginModal isOpen={isOpen} toggleModal={toggleModal}/>
  </header>
  );
}

export default Header;
