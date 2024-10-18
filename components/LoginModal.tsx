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
            <h2 className="text-2xl text-black font-bold mb-4">Login</h2>
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
              <div className="">
                <p className="text-black">아직 회원이 아니신가요?</p>
                <button type="button" onClick={toggleModal} className="text-red-500">
                  회원가입 하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
