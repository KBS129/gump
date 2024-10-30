"use client";

import { useModal } from "@/app/(providers)/(_providers)/ModalProvider";
import { PropsWithChildren } from "react";

function Backdrop(props: PropsWithChildren) {
  const { closeModal } = useModal();

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-10 grid place-items-center"
      onClick={() => closeModal()}
    >
      {props.children}
    </div>
  );
}

export default Backdrop;
