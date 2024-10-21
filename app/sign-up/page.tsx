"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpUser } from "@/api/supabase.api"; // 회원가입 API 불러오기

const SignupPage = () => {
  // 상태 정의
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // Supabase API를 사용하여 회원가입 처리
      const result = await signUpUser(email, password);

      if (!result.success) {
        setError(result.message || "회원가입 중 오류가 발생했습니다.");
        console.error(result.message);
      } else {
        setSuccess("회원가입이 완료되었습니다.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError("");

        // 회원가입 성공 후 다른 페이지로 리디렉션 (예: 홈 페이지)
        router.push("/");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
      console.error("Error:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && (
            <div className="text-green-500 text-sm mb-4">{success}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <input
                type="email"
                id="em	ail"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
