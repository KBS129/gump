"use client";

import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";
import NewReviewModal from "../(root)/movies/[movieId]/_components/NewReviewModal";
import LoginModal from "@/components/LoginModal";

// 모달 컨텍스트의 타입 정의
interface ModalContextType {
  openModal: (modalName: "newReview" | "login") => void;
  closeModal: () => void;
}

// 모달 컨텍스트 생성
const ModalContext = createContext<ModalContextType | null>(null);

// 모달 프로바이더 컴포넌트
export const ModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null); // 현재 활성화된 모달을 추적

  // 모달 열기 함수
  const openModal = (modalName: "newReview" | "login") =>
    setActiveModal(modalName);
  // 모달 닫기 함수
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {/* 모달 상태에 따라 해당 모달을 렌더링 */}
      {activeModal === "newReview" && <NewReviewModal />}
      {activeModal === "login" && (
        <LoginModal
          isOpen={true} // isOpen의 값을 true로 설정
          setIsLoggedIn={() => {}} // 여기서 setIsLoggedIn의 실제 구현체를 제공해야 합니다.
          toggleModal={closeModal} // closeModal 사용
        />
      )}
    </ModalContext.Provider>
  );
};

// 모달 컨텍스트 훅
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
