"use client";

import { useModal } from "@/app/(providers)/(_providers)/ModalProvider";
import { PropsWithChildren, ReactNode } from "react";

interface BackdropProps {
  children: ReactNode;
}

function Backdrop({ children }: PropsWithChildren<BackdropProps>) {
  const { closeModal } = useModal();

  const handleClick = () => {
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-10 grid place-items-center"
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

export default Backdrop;
