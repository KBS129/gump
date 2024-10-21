"use client";

import React, { useState, useEffect } from 'react';

const LoginModal = ({isOpen, toggleModal}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-full h-full">
          <div className="bg-white rounded p-6 w-96 z-50">
            {/* 로그인 제목 중앙 정렬 */}
            <h2 className="text-2xl text-black font-bold mb-4 text-center">로그인</h2>
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
              <button type="submit" className="bg-blue-500 text-white rounded p-2">
                로그인하기
              </button>
              <button type="button" onClick={toggleModal} className="text-red-500">
                취소
              </button>
              {/* 회원가입 안내 및 버튼 중앙 정렬 */}
              <div className="flex flex-col items-center space-y-2">
                <p className="text-black">아직 회원이 아니신가요?</p>
                <a href="/sign-up" className="text-lg text-red-500">회원가입하기</a>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
